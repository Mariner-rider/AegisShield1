import { describe, expect, it } from "vitest";
import {
  generateReport,
  ReportScheduler,
  ReportingData,
  TenantBranding,
  toJson,
  toPdf
} from "../../services/reporting/src";

const tenant: TenantBranding = {
  tenantId: "t-1",
  tenantName: "Acme Corp",
  logoUrl: "https://example.com/logo.png"
};

const data: ReportingData = {
  tenantId: "t-1",
  generatedAt: "2026-05-01T00:00:00Z",
  threats: [
    { id: "thr-1", detectedAt: "2026-04-29T00:00:00Z", severity: "critical", source: "detector", category: "auth" }
  ],
  policies: [
    { id: "pol-1", enabled: true, updatedAt: "2026-04-28T00:00:00Z", frameworkTags: ["OWASP_TOP_10_2025"] },
    { id: "pol-2", enabled: false, updatedAt: "2026-04-28T00:00:00Z", frameworkTags: ["NIST_CSF_HIGH_LEVEL"] }
  ],
  audits: [{ id: "aud-1", actor: "admin", action: "policy.update", createdAt: "2026-04-30T00:00:00Z" }]
};

describe("compliance reporting engine", () => {
  it("generates report with disclaimer and sections", () => {
    const report = generateReport("compliance_mapping_report", data, tenant);
    expect(report.disclaimer).toContain("Supporting evidence / internal reporting");
    expect(report.executiveSummary.length).toBeGreaterThan(0);
    expect(Object.keys(report.technicalAppendix).length).toBeGreaterThan(0);
    expect(report.mappings.length).toBeGreaterThan(0);
  });

  it("exports report to json and pdf formats", () => {
    const report = generateReport("security_posture_summary", data, tenant);
    expect(toJson(report)).toContain("Acme Corp");
    expect(toPdf(report)).toContain("AegisShield Compliance Report");
  });

  it("saves weekly and monthly report schedules", () => {
    const scheduler = new ReportScheduler();
    scheduler.upsert({ tenantId: "t-1", schedule: "weekly", reportTypes: ["security_posture_summary"] });
    scheduler.upsert({ tenantId: "t-1", schedule: "monthly", reportTypes: ["audit_trail_report"] });

    expect(scheduler.listByTenant("t-1")).toHaveLength(2);
  });
});
