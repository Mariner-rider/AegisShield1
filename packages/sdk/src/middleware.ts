import { z } from "zod";
import { EmbeddedPolicyEngine } from "../../policy-engine/src";
import { SecurityEvent, DetectionResult, OperatingMode } from "./types";

const envSchema = z.object({ AEGIS_MODE: z.enum(["observe", "guard", "contain", "emergency"]).default("observe") });
const attempts = new Map<string, { count: number; firstSeen: number }>();
const tokenSeen = new Map<string, string>();

function prune(windowMs = 60_000): void {
  const now = Date.now();
  for (const [k, v] of attempts.entries()) if (now - v.firstSeen > windowMs) attempts.delete(k);
}

export function detect(event: SecurityEvent): DetectionResult {
  prune();
  const tags: string[] = [];
  const reasons: string[] = [];
  const sample = `${event.route} ${event.bodySample ?? ""}`.toLowerCase();
  const key = `${event.ip}:${event.route}`;
  const cur = attempts.get(key) ?? { count: 0, firstSeen: Date.now() };
  cur.count += 1;
  attempts.set(key, cur);

  if (event.route === "/login" && cur.count > 5) { tags.push("brute_force"); reasons.push("excessive login attempts"); }
  if (/union\s+select|<script|;\s*drop|\|\|\s*whoami/.test(sample)) { tags.push("injection_pattern"); reasons.push("injection signature"); }
  if (/169\.254\.169\.254|localhost|127\.0\.0\.1/.test(sample)) { tags.push("ssrf"); reasons.push("metadata/internal target"); }
  if (/\/admin/.test(event.route) && !event.headers["x-admin-mfa"]) { tags.push("access_control_violation"); reasons.push("admin without mfa"); }
  if (cur.count > 30) { tags.push("bot_scrape_burst"); reasons.push("burst traffic pattern"); }
  if (event.tokenId) {
    const priorIp = tokenSeen.get(event.tokenId);
    if (priorIp && priorIp !== event.ip) { tags.push("suspicious_token_reuse"); reasons.push("token reused across IPs"); }
    tokenSeen.set(event.tokenId, event.ip);
  }

  const severity = Math.min(100, tags.length * 20 + (cur.count > 10 ? 20 : 0));
  return { score: severity, tags, reasons, decisionTrace: { severity, reasons, tags } };
}

export function createMiddleware() {
  const env = envSchema.parse(process.env);
  const policy = new EmbeddedPolicyEngine();
  const mode = env.AEGIS_MODE as OperatingMode;
  return (req: any, res: any, next: any) => {
    const event: SecurityEvent = {
      route: String(req.path || ""), method: String(req.method || "GET"), ip: String(req.ip || "0.0.0.0"),
      tokenId: req.headers?.authorization, headers: req.headers ?? {},
      bodySample: JSON.stringify(req.body ?? {}).slice(0, 1024), timestamp: new Date().toISOString()
    };
    const detection = detect(event);
    const decision = policy.evaluate({ mode, event, detection });
    if (!decision.allow) return res.status(403).json({ blocked: true, reason: decision.reason, actions: decision.actions, trace: detection.decisionTrace });
    if (mode === "emergency" && event.method !== "GET") return res.status(503).json({ blocked: true, reason: "read-only mode active" });
    return next();
  };
}
