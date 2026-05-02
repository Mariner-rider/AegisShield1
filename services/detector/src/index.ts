export * from "./types";
export * from "./packs/rules";
export * from "./alerts";

import { IngestedRequestEvent, DetectionEvent } from "./types";
import { evaluateRules } from "./packs/rules";
import { createClient } from "redis";

export interface SuppressionRule { tenantId: string; ruleId: string; expiresAt: string; reason: string; }

const redis = createClient({ url: process.env.REDIS_URL ?? "redis://localhost:6379" });

export class DetectionPipeline {
  private suppression: SuppressionRule[] = [];

  async addSuppression(rule: SuppressionRule): Promise<void> {
    this.suppression.push(rule);
    if (!redis.isOpen) await redis.connect();
    await redis.set(`suppression:${rule.tenantId}:${rule.ruleId}`, JSON.stringify(rule), { PXAT: new Date(rule.expiresAt).getTime() });
  }

  async ingest(event: IngestedRequestEvent): Promise<DetectionEvent> {
    if (!redis.isOpen) await redis.connect();
    const ipKey = `${event.tenantId}:${event.ip}`;
    const recentByIp = await redis.incr(`ipCounter:${ipKey}`);
    await redis.expire(`ipCounter:${ipKey}`, 3600);

    let tokenIpChanged = false;
    if (event.tokenId) {
      const tokenKey = `tokenIp:${event.tenantId}:${event.tokenId}`;
      const prev = await redis.get(tokenKey);
      tokenIpChanged = Boolean(prev && prev !== event.ip);
      await redis.set(tokenKey, event.ip, { EX: 3600 });
    }

    const findings = evaluateRules(event, { recentByIp, tokenIpChanged, recentByUser: 0 });
    const now = new Date();
    const activeSuppressions = this.suppression.filter(s => s.tenantId === event.tenantId && new Date(s.expiresAt) > now).map(s => s.ruleId);
    const unsuppressed = findings.filter(f => !activeSuppressions.includes(f.ruleId));
    return { tenantId: event.tenantId, projectId: event.projectId, environment: event.environment, sourceEventAt: event.timestamp, findings: unsuppressed, suppressed: findings.length > 0 && unsuppressed.length === 0 };
  }
}
