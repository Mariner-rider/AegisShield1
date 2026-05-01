import { IngestedRequestEvent, DetectionEvent } from "./types";
import { evaluateRules } from "./packs/rules";

export interface SuppressionRule { tenantId: string; ruleId: string; expiresAt: string; reason: string; }

export class DetectionPipeline {
  private ipCounter = new Map<string, number>();
  private tokenIp = new Map<string, string>();
  private suppression: SuppressionRule[] = [];

  addSuppression(rule: SuppressionRule): void { this.suppression.push(rule); }

  ingest(event: IngestedRequestEvent): DetectionEvent {
    const ipKey = `${event.tenantId}:${event.ip}`;
    const recentByIp = (this.ipCounter.get(ipKey) ?? 0) + 1;
    this.ipCounter.set(ipKey, recentByIp);

    const tokenPrevIp = event.tokenId ? this.tokenIp.get(`${event.tenantId}:${event.tokenId}`) : undefined;
    const tokenIpChanged = Boolean(event.tokenId && tokenPrevIp && tokenPrevIp !== event.ip);
    if (event.tokenId) this.tokenIp.set(`${event.tenantId}:${event.tokenId}`, event.ip);

    const findings = evaluateRules(event, { recentByIp, tokenIpChanged, recentByUser: 0 });
    const now = new Date();
    const activeSuppressions = this.suppression.filter(s => s.tenantId === event.tenantId && new Date(s.expiresAt) > now).map(s => s.ruleId);
    const unsuppressed = findings.filter(f => !activeSuppressions.includes(f.ruleId));

    return {
      tenantId: event.tenantId,
      projectId: event.projectId,
      environment: event.environment,
      sourceEventAt: event.timestamp,
      findings: unsuppressed,
      suppressed: findings.length > 0 && unsuppressed.length === 0
    };
  }
}
