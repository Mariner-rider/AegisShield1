export type Framework = "OWASP_TOP_10_2025" | "ISO_27001_BASIC" | "NIST_CSF_HIGH_LEVEL";

export type ReportType =
  | "security_posture_summary"
  | "detected_threats_summary"
  | "policy_coverage_report"
  | "audit_trail_report"
  | "compliance_mapping_report";

export type Severity = "low" | "medium" | "high" | "critical";

export interface TenantBranding {
  tenantId: string;
  tenantName: string;
  logoUrl?: string;
}

export interface ThreatRecord {
  id: string;
  detectedAt: string;
  severity: Severity;
  source: string;
  category: string;
}

export interface PolicyRecord {
  id: string;
  enabled: boolean;
  updatedAt: string;
  frameworkTags: Framework[];
}

export interface AuditRecord {
  id: string;
  actor: string;
  action: string;
  createdAt: string;
}

export interface ReportingData {
  tenantId: string;
  generatedAt: string;
  threats: ThreatRecord[];
  policies: PolicyRecord[];
  audits: AuditRecord[];
}

export interface Scorecard {
  overall: number;
  threatReadiness: number;
  policyCoverage: number;
  auditHygiene: number;
}

export interface ComplianceMapping {
  framework: Framework;
  control: string;
  policyIds: string[];
  status: "covered" | "partial" | "gap";
}

export interface RenderedReport {
  reportType: ReportType;
  tenant: TenantBranding;
  disclaimer: string;
  executiveSummary: string;
  technicalAppendix: Record<string, unknown>;
  scorecard: Scorecard;
  mappings: ComplianceMapping[];
  generatedAt: string;
}
