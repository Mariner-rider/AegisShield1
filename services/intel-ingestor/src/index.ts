import { ThreatIntelRecord, shouldAutoApply } from "../../../packages/threat-intel-client/src";

export function normalizeKevItem(raw: any): ThreatIntelRecord {
  return { id: raw.cveID, source: "cisa-kev", type: "severity", value: raw.vendorProject, severity: "high", observedAt: new Date().toISOString() };
}

export function weeklySafeUpdate(records: ThreatIntelRecord[]): ThreatIntelRecord[] {
  return records.filter(shouldAutoApply);
}
