export interface ConsoleSection {
  id: string;
  title: string;
  route: string;
  group: "observe" | "protect" | "govern" | "operate";
  emptyState: string;
}

export const consolePages: ConsoleSection[] = [
  { id: "projects", title: "Projects", route: "/projects", group: "operate", emptyState: "Create your first project." },
  { id: "project-detail", title: "Project Detail", route: "/projects/:projectId", group: "operate", emptyState: "Project details unavailable." },
  { id: "environments", title: "Environments", route: "/environments", group: "operate", emptyState: "No environments configured." },
  { id: "installation-status", title: "Installation Status", route: "/installation-status", group: "operate", emptyState: "No heartbeat received yet." },
  { id: "attacks-feed", title: "Attacks Feed", route: "/attacks-feed", group: "observe", emptyState: "No attack events yet." },
  { id: "detections", title: "Detections", route: "/detections", group: "observe", emptyState: "No detections yet." },
  { id: "detection-detail", title: "Detection Detail", route: "/detections/:detectionId", group: "observe", emptyState: "Detection not found." },
  { id: "response-actions", title: "Response Actions", route: "/response-actions", group: "protect", emptyState: "No response actions yet." },
  { id: "policy-bundles", title: "Policy Bundles", route: "/policy-bundles", group: "protect", emptyState: "No policy bundles published." },
  { id: "api-keys-tokens", title: "API Keys & Tokens", route: "/api-keys-tokens", group: "govern", emptyState: "No credentials created yet." },
  { id: "team-members", title: "Team Members", route: "/team-members", group: "govern", emptyState: "Invite your team to collaborate." },
  { id: "subscription-billing", title: "Subscription and Billing", route: "/subscription-billing", group: "govern", emptyState: "Subscription details unavailable." },
  { id: "settings", title: "Settings", route: "/settings", group: "govern", emptyState: "No settings configured." },
  { id: "audit-trail", title: "Audit Trail", route: "/audit-trail", group: "govern", emptyState: "No audit records yet." }
];
