import { RenderedReport } from "../types";

export function toJson(report: RenderedReport): string {
  return JSON.stringify(report, null, 2);
}

export function toPdf(report: RenderedReport): string {
  // Internal placeholder representation for PDF payload until binary renderer is added.
  const lines = [
    `AegisShield Compliance Report`,
    `Tenant: ${report.tenant.tenantName}`,
    `Generated: ${report.generatedAt}`,
    `Disclaimer: ${report.disclaimer}`,
    `Executive Summary: ${report.executiveSummary}`,
    `Score: ${report.scorecard.overall}`
  ];

  return lines.join("\n");
}
