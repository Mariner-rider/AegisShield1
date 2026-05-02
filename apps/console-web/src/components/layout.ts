import { cloudShieldDarkTheme } from "./theme";

export interface NavItem { label: string; route: string; icon: string; badge?: string; }
export const navItems: NavItem[] = [
  { label: "Overview", route: "/overview", icon: "grid" },
  { label: "Projects", route: "/projects", icon: "folder" },
  { label: "Environments", route: "/environments", icon: "layers" },
  { label: "Installation", route: "/installation-status", icon: "server" },
  { label: "Attacks", route: "/attacks-feed", icon: "shield-alert", badge: "live" },
  { label: "Detections", route: "/detections", icon: "radar" },
  { label: "Responses", route: "/response-actions", icon: "zap" },
  { label: "Policy Bundles", route: "/policy-bundles", icon: "scroll" },
  { label: "API Keys & Tokens", route: "/api-keys-tokens", icon: "key" },
  { label: "Team", route: "/team-members", icon: "users" },
  { label: "Subscription", route: "/subscription-billing", icon: "credit-card" },
  { label: "Settings", route: "/settings", icon: "settings" },
  { label: "Audit", route: "/audit-trail", icon: "history" }
];

export const responsiveHints = { mobileBreakpoint: 1024, collapseSidebar: true, denseTableBreakpoint: 1280 };

export const shellLayout = {
  sidebarWidth: 280,
  headerHeight: 64,
  contentMaxWidth: 1440,
  showCommandPalette: true,
  theme: cloudShieldDarkTheme
};
