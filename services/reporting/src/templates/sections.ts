import { ReportingData, Scorecard } from "../types";

export function buildExecutiveSummary(data: ReportingData, scorecard: Scorecard): string {
  return `Executive Summary for ${data.tenantId}: overall score ${scorecard.overall}/100 with ${data.threats.length} threats and ${data.policies.length} policies assessed.`;
}

export function buildTechnicalAppendix(data: ReportingData): Record<string, unknown> {
  return {
    threatBreakdown: data.threats.reduce<Record<string, number>>((acc, threat) => {
      acc[threat.severity] = (acc[threat.severity] ?? 0) + 1;
      return acc;
    }, {}),
    policyStates: {
      enabled: data.policies.filter((policy) => policy.enabled).length,
      disabled: data.policies.filter((policy) => !policy.enabled).length
    },
    auditSampleSize: data.audits.length
  };
}
