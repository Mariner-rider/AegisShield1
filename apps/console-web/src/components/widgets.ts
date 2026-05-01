export interface DashboardWidget { id: string; title: string; value: string; trend?: string; }
export const defaultWidgets: DashboardWidget[] = [
  { id: "requests", title: "Requests inspected", value: "1,245,203", trend: "+12%" },
  { id: "blocked", title: "Attacks blocked", value: "3,918", trend: "+6%" },
  { id: "sessions", title: "Suspicious sessions", value: "42", trend: "-3%" },
  { id: "routes", title: "Top attacked routes", value: "/login, /admin" },
  { id: "ips", title: "Top source IPs / ASNs", value: "203.0.113.10 (AS64500)" },
  { id: "policy", title: "Recent policy changes", value: "v1.3.4 promoted" },
  { id: "subscription", title: "Trial / subscription status", value: "Trial day 12 of 30" }
];
