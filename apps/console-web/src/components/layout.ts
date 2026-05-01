export interface NavItem { label: string; route: string; }
export const navItems: NavItem[] = [
  { label: "Overview", route: "/overview" },
  { label: "Projects", route: "/projects" },
  { label: "Environments", route: "/environments" },
  { label: "Installation", route: "/installation-status" },
  { label: "Attacks", route: "/attacks-feed" },
  { label: "Detections", route: "/detections" },
  { label: "Responses", route: "/response-actions" },
  { label: "Policy Bundles", route: "/policy-bundles" },
  { label: "API Keys & Tokens", route: "/api-keys-tokens" },
  { label: "Team", route: "/team-members" },
  { label: "Subscription", route: "/subscription-billing" },
  { label: "Settings", route: "/settings" },
  { label: "Audit", route: "/audit-trail" }
];

export const responsiveHints = { mobileBreakpoint: 768, collapseSidebar: true };
