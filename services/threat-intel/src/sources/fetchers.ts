import { RawIntelItem } from "../types";

export async function fetchCisaKev(): Promise<RawIntelItem[]> {
  return [{ source: "cisa_kev", externalId: "CVE-2024-0001", payload: { cve: "CVE-2024-0001", severity: "high" }, observedAt: new Date().toISOString() }];
}

export async function fetchCisaAdvisories(): Promise<RawIntelItem[]> {
  return [{ source: "cisa_advisory", externalId: "AA24-123A", payload: { title: "Advisory", tags: ["ioc"] }, observedAt: new Date().toISOString() }];
}

export async function fetchDependencyAdvisories(): Promise<RawIntelItem[]> {
  return [{ source: "dependency_feed", externalId: "GHSA-xxxx", payload: { package: "lib-a", severity: "medium" }, observedAt: new Date().toISOString() }];
}

export async function loadManualIocList(iocs: string[]): Promise<RawIntelItem[]> {
  return iocs.map((v, i) => ({ source: "manual_ioc", externalId: `MANUAL-${i}`, payload: { value: v }, observedAt: new Date().toISOString() }));
}
