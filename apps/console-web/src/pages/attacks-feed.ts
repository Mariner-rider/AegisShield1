export type AttackSeverity = "low" | "medium" | "high" | "critical";

export interface AttackFeedRow {
  id: string;
  detectedAt: string;
  sourceIp: string;
  route: string;
  attackType: string;
  severity: AttackSeverity;
  blocked: boolean;
  live: boolean;
  quickActions: Array<"block-ip" | "open-session" | "create-rule">;
}

export const attackSeverityBadgeTone: Record<AttackSeverity, "neutral" | "warning" | "critical"> = {
  low: "neutral",
  medium: "neutral",
  high: "warning",
  critical: "critical"
};

export const attacksFeedPage = {
  id: "attacks-feed",
  title: "Attacks Feed",
  route: "/attacks-feed",
  liveIndicatorLabel: "Live",
  columns: ["detectedAt", "sourceIp", "route", "attackType", "severity", "blocked", "quickActions"],
  rows: [] as AttackFeedRow[]
};
