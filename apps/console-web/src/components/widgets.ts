export interface DashboardWidget {
  id: string;
  title: string;
  value: string;
  trend?: string;
  tone: "neutral" | "good" | "warning" | "critical";
  chartId?: "requestVolume" | "attackTypes" | "protectionScore";
  actionLabel?: string;
}

export const defaultWidgets: DashboardWidget[] = [
  { id: "requests", title: "Requests inspected", value: "1,245,203", trend: "+12%", tone: "neutral", chartId: "requestVolume", actionLabel: "View traffic" },
  { id: "blocked", title: "Attacks blocked", value: "3,918", trend: "+6%", tone: "good", chartId: "attackTypes", actionLabel: "Open attacks feed" },
  { id: "score", title: "Protection score", value: "98.4", trend: "+0.7", tone: "good", chartId: "protectionScore", actionLabel: "Drill into score" },
  { id: "sessions", title: "Suspicious sessions", value: "42", trend: "-3%", tone: "warning", actionLabel: "Investigate" },
  { id: "routes", title: "Top attacked routes", value: "/login, /admin", tone: "critical", actionLabel: "Harden routes" },
  { id: "ips", title: "Top source IPs / ASNs", value: "203.0.113.10 (AS64500)", tone: "warning", actionLabel: "Blocklist" },
  { id: "policy", title: "Recent policy changes", value: "v1.3.4 promoted", tone: "neutral", actionLabel: "Open policies" },
  { id: "subscription", title: "Trial / subscription status", value: "Trial day 12 of 30", tone: "neutral", actionLabel: "Manage plan" }
];
