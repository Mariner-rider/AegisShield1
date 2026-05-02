export interface ThreatIntelRecord {
  id: string;
  source: "cisa-kev" | "advisory" | "dependency";
  type: "ioc" | "denylist" | "severity" | "recommendation";
  value: string;
  severity: "low" | "medium" | "high" | "critical";
  observedAt: string;
}

export const AUTO_APPLY_TYPES: ThreatIntelRecord["type"][] = ["ioc", "denylist", "severity"];

export function shouldAutoApply(record: ThreatIntelRecord): boolean {
  return AUTO_APPLY_TYPES.includes(record.type);
}
