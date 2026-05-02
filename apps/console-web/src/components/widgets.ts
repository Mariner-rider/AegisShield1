export interface DashboardWidget {
  id: string;
  title: string;
  value: string;
  trend?: string;
  tone: "neutral" | "good" | "warning" | "critical";
  sparkline?: number[];
  actionLabel?: string;
}

export const defaultWidgets: DashboardWidget[] = [
  { id: "requests", title: "Requests inspected", value: "1,245,203", trend: "+12%", tone: "neutral", sparkline: [62, 68, 71, 76, 81, 88, 92], actionLabel: "View traffic" },
  { id: "blocked", title: "Attacks blocked", value: "3,918", trend: "+6%", tone: "good", sparkline: [18, 19, 21, 22, 24, 25, 27], actionLabel: "Open attacks feed" },
  { id: "sessions", title: "Suspicious sessions", value: "42", trend: "-3%", tone: "warning", sparkline: [11, 10, 8, 7, 6, 5, 4], actionLabel: "Investigate" },
  { id: "routes", title: "Top attacked routes", value: "/login, /admin", tone: "critical", actionLabel: "Harden routes" },
  { id: "ips", title: "Top source IPs / ASNs", value: "203.0.113.10 (AS64500)", tone: "warning", actionLabel: "Blocklist" },
  { id: "policy", title: "Recent policy changes", value: "v1.3.4 promoted", tone: "neutral", actionLabel: "Open policies" },
  { id: "subscription", title: "Trial / subscription status", value: "Trial day 12 of 30", tone: "neutral", actionLabel: "Manage plan" }
];
