import { IntegrationConfig, SocEvent } from "../types";
import { sendGenericWebhook } from "../connectors/webhook";
import { sendSlack } from "../connectors/slack";
import { sendTeams } from "../connectors/teams";

const dedupe = new Map<string, number>();
const rate = new Map<string, { n: number; ts: number }>();

function allowRate(key: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const r = rate.get(key);
  if (!r || now - r.ts > windowMs) { rate.set(key, { n: 1, ts: now }); return true; }
  r.n += 1; return r.n <= limit;
}

function seenRecently(key: string, windowMs = 300_000): boolean {
  const now = Date.now();
  const t = dedupe.get(key);
  if (t && now - t < windowMs) return true;
  dedupe.set(key, now);
  return false;
}

async function sendWithRetry(fn: () => Promise<boolean>, retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) if (await fn()) return true;
  return false;
}

export async function deliverEvent(configs: IntegrationConfig[], e: SocEvent): Promise<{ delivered: number; skipped: number }> {
  let delivered = 0, skipped = 0;
  for (const c of configs) {
    if (!c.enabled || e.severity < c.severityThreshold || !c.eventTypes.includes(e.eventType)) { skipped++; continue; }
    const key = `${c.id}:${e.eventType}:${e.projectId}:${e.summary}`;
    if (seenRecently(key) || !allowRate(c.id)) { skipped++; continue; }
    const ok = c.type === "webhook"
      ? await sendWithRetry(() => sendGenericWebhook(c.endpoint, e))
      : c.type === "slack"
      ? await sendWithRetry(() => sendSlack(c.endpoint, e))
      : await sendWithRetry(() => sendTeams(c.endpoint, e));
    if (ok) delivered++; else skipped++;
  }
  return { delivered, skipped };
}
