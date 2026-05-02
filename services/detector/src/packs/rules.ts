import { IngestedRequestEvent, DetectionFinding } from "../types";

export interface DetectorContext { recentByIp: number; tokenIpChanged: boolean; recentByUser: number; }

export function evaluateRules(e: IngestedRequestEvent, ctx: DetectorContext): DetectionFinding[] {
  const out: DetectionFinding[] = [];
  const route = e.route.toLowerCase();
  const sample = `${route} ${e.bodySample ?? ""}`.toLowerCase();

  if ((route.includes("/login") || route.includes("/auth")) && e.status === 401 && ctx.recentByIp >= 5) {
    out.push({ pack: "auth", ruleId: "brute-force-credential-stuffing", ruleVersion: "1.0.0", confidence: 0.88, severity: 72, recommendation: "Enable challenge and temporary account/IP cooldown.", responseCandidate: "challenge_request", decisionTrace: ["multiple failed auths", `recentByIp=${ctx.recentByIp}`] });
  }
  if (ctx.tokenIpChanged) {
    out.push({ pack: "session", ruleId: "suspicious-token-reuse", ruleVersion: "1.0.0", confidence: 0.82, severity: 78, recommendation: "Require re-authentication and inspect token replay risk.", responseCandidate: "quarantine_session", decisionTrace: ["token used across distinct IPs"] });
  }
  if (route.startsWith("/admin") && !e.userAgent) {
    out.push({ pack: "admin", ruleId: "admin-route-probing", ruleVersion: "1.0.0", confidence: 0.74, severity: 66, recommendation: "Require strong auth context for admin routes and monitor probes.", responseCandidate: "notify_operators", decisionTrace: ["admin route with weak client context"] });
  }
  if (/(169\.254\.169\.254|localhost|127\.0\.0\.1)/.test(sample) || ["169.254.169.254", "localhost"].includes(String(e.outboundHost))) {
    out.push({ pack: "network", ruleId: "ssrf-outbound-abuse", ruleVersion: "1.0.0", confidence: 0.93, severity: 90, recommendation: "Block request and enforce outbound allowlist.", responseCandidate: "block_request", decisionTrace: ["metadata/internal target indicator"] });
  }
  if (ctx.recentByIp > 40) {
    out.push({ pack: "traffic", ruleId: "anomalous-request-burst", ruleVersion: "1.0.0", confidence: 0.79, severity: 70, recommendation: "Throttle/bot challenge this traffic source.", responseCandidate: "challenge_request", decisionTrace: ["burst threshold exceeded", `recentByIp=${ctx.recentByIp}`] });
  }
  if (/(\.\./|union\s+select|<script|;\s*drop|\|\|\s*whoami)/.test(sample)) {
    out.push({ pack: "payload", ruleId: "path-traversal-injection-heuristics", ruleVersion: "1.0.0", confidence: 0.91, severity: 88, recommendation: "Block request and inspect payload source.", responseCandidate: "block_request", decisionTrace: ["path traversal/injection heuristic match"] });
  }
  if ((route.includes("/users/") || route.includes("/accounts/")) && e.userId && !route.includes(e.userId)) {
    out.push({ pack: "access", ruleId: "bola-bopla-risk-hint", ruleVersion: "1.0.0", confidence: 0.68, severity: 64, recommendation: "Verify object-level and property-level authorization checks.", responseCandidate: "notify_operators", decisionTrace: ["resource identifier mismatch with principal"] });
  }
  return out;
}
