export * from "./types";
export * from "./packs/rules";
export * from "./alerts";

import { Queue, Worker } from "bullmq";
import { Client as PgClient } from "pg";
import { createClient } from "redis";
import { evaluateRules } from "./packs/rules";
import { DetectionEvent, DetectionFinding, IngestedRequestEvent } from "./types";
import { ThreatIntelRecord } from "../../../packages/threat-intel-client/src";

export interface SuppressionRule { tenantId: string; ruleId: string; expiresAt: string; reason: string; }
export interface TenantRuleConfig { enabledPacks: string[]; severityMultiplier: number; }

const redis = createClient({ url: process.env.REDIS_URL ?? "redis://localhost:6379" });
const pg = new PgClient({ connectionString: process.env.DATABASE_URL ?? "postgresql://aegis:aegis@localhost:5432/aegis" });

const queueName = "detector-ingest";
const bullConnection = { url: process.env.REDIS_URL ?? "redis://localhost:6379" };
const ingestQueue = new Queue(queueName, { connection: bullConnection });

const signatureMatchers = [
  { id: "sql_injection_signature", regex: /(\bUNION\b|\bSELECT\b.+\bFROM\b|\bOR\b\s+1=1|--|;\s*DROP\s+TABLE)/i, severity: 85, recommendation: "Block request and sanitize query params." },
  { id: "xss_signature", regex: /(<script|javascript:|onerror=|onload=)/i, severity: 80, recommendation: "Sanitize/encode user input and enable CSP." },
  { id: "csrf_signature", regex: /(csrf_token_missing|cross-site\s+request)/i, severity: 65, recommendation: "Validate CSRF tokens and same-site cookies." },
  { id: "path_traversal_signature", regex: /(\.\.\/|%2e%2e%2f|\/etc\/passwd)/i, severity: 78, recommendation: "Normalize file paths and deny traversal patterns." }
];

const suppressionRules: SuppressionRule[] = [];
const tenantRuleConfigs = new Map<string, TenantRuleConfig>();
let intelFeed: ThreatIntelRecord[] = [];

function logisticRiskScore(features: number[]): number {
  const weights = [0.8, 1.2, 1.0, 0.6, 0.9];
  const z = features.reduce((sum, feature, i) => sum + feature * (weights[i] ?? 0), -1.4);
  return 1 / (1 + Math.exp(-z));
}

function offHours(ts: string): boolean {
  const hour = new Date(ts).getUTCHours();
  return hour < 5 || hour > 22;
}

function buildSignatureFindings(event: IngestedRequestEvent): DetectionFinding[] {
  const payload = `${event.route} ${event.bodySample ?? ""} ${event.userAgent ?? ""}`;
  return signatureMatchers
    .filter((matcher) => matcher.regex.test(payload))
    .map((matcher) => ({
      pack: "signature",
      ruleId: matcher.id,
      ruleVersion: "1.0.0",
      confidence: 0.88,
      severity: matcher.severity,
      recommendation: matcher.recommendation,
      responseCandidate: "block_request" as const,
      decisionTrace: [`signature match: ${matcher.id}`]
    }));
}

async function persistDetectionEvent(event: DetectionEvent, riskScore: number): Promise<void> {
  await pg.query(
    `INSERT INTO "DetectionEvent" ("id", "tenantId", "type", "severity", "payload", "createdAt")
     VALUES (md5(random()::text || clock_timestamp()::text), $1, $2, $3, $4::jsonb, NOW())`,
    [event.tenantId, "pipeline_detection", Math.round(riskScore * 100), JSON.stringify(event)]
  );
}

async function resolveGeoImpossibility(event: IngestedRequestEvent): Promise<boolean> {
  if (!event.userId) return false;
  const key = `geo:${event.tenantId}:${event.userId}`;
  const prev = await redis.get(key);
  await redis.set(key, event.ip, { EX: 3600 });
  return Boolean(prev && prev !== event.ip);
}

export class DetectionPipeline {
  constructor() {
    new Worker(queueName, async (job) => this.process(job.data as IngestedRequestEvent), { connection: bullConnection });
  }

  configureTenantRules(tenantId: string, config: TenantRuleConfig): void {
    tenantRuleConfigs.set(tenantId, config);
  }

  setThreatIntel(records: ThreatIntelRecord[]): void {
    intelFeed = records;
  }

  async addSuppression(rule: SuppressionRule): Promise<void> {
    suppressionRules.push(rule);
    if (!redis.isOpen) await redis.connect();
    await redis.set(`suppression:${rule.tenantId}:${rule.ruleId}`, JSON.stringify(rule), { PXAT: new Date(rule.expiresAt).getTime() });
  }

  async enqueue(event: IngestedRequestEvent): Promise<void> {
    await ingestQueue.add("ingest", event, { removeOnComplete: 500, removeOnFail: 500 });
  }

  async ingest(event: IngestedRequestEvent): Promise<DetectionEvent> {
    return this.process(event);
  }

  private async process(event: IngestedRequestEvent): Promise<DetectionEvent> {
    if (!redis.isOpen) await redis.connect();
    if (pg._connected !== true) await pg.connect();

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

    const geoImpossible = await resolveGeoImpossibility(event);
    const offHoursAccess = offHours(event.timestamp);
    const baseFindings = evaluateRules(event, { recentByIp, tokenIpChanged, recentByUser: 0 });
    const signatureFindings = buildSignatureFindings(event);

    const intelMatches = intelFeed
      .filter((record) => record.type === "ioc" && (event.ip.includes(record.value) || event.route.includes(record.value)))
      .map((record) => ({
        pack: "threat-intel",
        ruleId: `intel_${record.id}`,
        ruleVersion: "1.0.0",
        confidence: 0.9,
        severity: record.severity === "critical" ? 95 : record.severity === "high" ? 85 : 70,
        recommendation: `Block IOC from ${record.source}`,
        responseCandidate: "block_request" as const,
        decisionTrace: [`intel match from ${record.source}`]
      }));

    const riskScore = logisticRiskScore([
      recentByIp / 10,
      tokenIpChanged ? 1 : 0,
      geoImpossible ? 1 : 0,
      offHoursAccess ? 1 : 0,
      signatureFindings.length > 0 ? 1 : 0
    ]);

    const anomalyFinding: DetectionFinding | null =
      riskScore > 0.75
        ? {
            pack: "behavioral-anomaly",
            ruleId: "behavioral_risk_high",
            ruleVersion: "1.0.0",
            confidence: riskScore,
            severity: Math.round(riskScore * 100),
            recommendation: "Require step-up auth and investigate session.",
            responseCandidate: "challenge_request",
            decisionTrace: [
              `risk=${riskScore.toFixed(2)}`,
              `velocity=${recentByIp}`,
              `geoImpossible=${geoImpossible}`,
              `offHours=${offHoursAccess}`
            ]
          }
        : null;

    const tenantCfg = tenantRuleConfigs.get(event.tenantId) ?? { enabledPacks: ["auth", "signature", "behavioral-anomaly", "threat-intel"], severityMultiplier: 1 };

    const findings = [...baseFindings, ...signatureFindings, ...intelMatches, ...(anomalyFinding ? [anomalyFinding] : [])]
      .filter((f) => tenantCfg.enabledPacks.includes(f.pack))
      .map((f) => ({ ...f, severity: Math.min(100, Math.round(f.severity * tenantCfg.severityMultiplier)) }));

    const now = new Date();
    const activeSuppressions = suppressionRules.filter(s => s.tenantId === event.tenantId && new Date(s.expiresAt) > now).map(s => s.ruleId);
    const unsuppressed = findings.filter(f => !activeSuppressions.includes(f.ruleId));

    const detectionEvent: DetectionEvent = {
      tenantId: event.tenantId,
      projectId: event.projectId,
      environment: event.environment,
      sourceEventAt: event.timestamp,
      findings: unsuppressed,
      suppressed: findings.length > 0 && unsuppressed.length === 0
    };

    await persistDetectionEvent(detectionEvent, riskScore);
    return detectionEvent;
  }
}
