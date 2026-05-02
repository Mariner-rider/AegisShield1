import { mapPoliciesToFrameworks } from "./frameworks/mappings";
import { buildExecutiveSummary, buildTechnicalAppendix } from "./templates/sections";
import { RenderedReport, ReportType, ReportingData, Scorecard, TenantBranding } from "./types";

export function aggregateTenantData(input: ReportingData): ReportingData {
  return {
    ...input,
    threats: [...input.threats].sort((a, b) => a.detectedAt.localeCompare(b.detectedAt)),
    audits: [...input.audits].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  };
}

export function scoreReportData(data: ReportingData): Scorecard {
  const criticalThreats = data.threats.filter((threat) => threat.severity === "critical").length;
  const enabledPolicies = data.policies.filter((policy) => policy.enabled).length;
  const policyCoverage = data.policies.length === 0 ? 0 : Math.round((enabledPolicies / data.policies.length) * 100);
  const auditHygiene = Math.min(100, data.audits.length * 5);
  const threatReadiness = Math.max(0, 100 - criticalThreats * 15);
  const overall = Math.round((threatReadiness + policyCoverage + auditHygiene) / 3);

  return { overall, threatReadiness, policyCoverage, auditHygiene };
}

export function generateReport(reportType: ReportType, data: ReportingData, tenant: TenantBranding): RenderedReport {
  const aggregated = aggregateTenantData(data);
  const scorecard = scoreReportData(aggregated);

  return {
    reportType,
    tenant,
    disclaimer: "Supporting evidence / internal reporting only. Not a certification.",
    executiveSummary: buildExecutiveSummary(aggregated, scorecard),
    technicalAppendix: buildTechnicalAppendix(aggregated),
    scorecard,
    mappings: mapPoliciesToFrameworks(aggregated.policies),
    generatedAt: aggregated.generatedAt
  };
}
