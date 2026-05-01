export const consolePages = [
  { id: "projects", title: "Projects List", route: "/projects", emptyState: "Create your first project." },
  { id: "project-detail", title: "Project Detail", route: "/projects/:projectId", emptyState: "Project details unavailable." },
  { id: "environments", title: "Environments", route: "/environments", emptyState: "No environments configured." },
  { id: "installation-status", title: "Installation Status", route: "/installation-status", emptyState: "No heartbeat received yet." },
  { id: "attacks-feed", title: "Attacks / Events Feed", route: "/attacks-feed", emptyState: "No attack events yet." },
  { id: "detection-detail", title: "Detection Detail", route: "/detections/:detectionId", emptyState: "Detection not found." },
  { id: "response-actions", title: "Response Actions History", route: "/response-actions", emptyState: "No response actions yet." },
  { id: "policy-bundles", title: "Policy Bundles", route: "/policy-bundles", emptyState: "No policy bundles published." },
  { id: "api-keys-tokens", title: "API Keys & Tokens", route: "/api-keys-tokens", emptyState: "No credentials created yet." },
  { id: "team-members", title: "Team Members", route: "/team-members", emptyState: "Invite your team to collaborate." },
  { id: "subscription-billing", title: "Subscription and Billing", route: "/subscription-billing", emptyState: "Subscription details unavailable." },
  { id: "settings", title: "Settings", route: "/settings", emptyState: "No settings configured." },
  { id: "audit-trail", title: "Audit Trail", route: "/audit-trail", emptyState: "No audit records yet." }
];
