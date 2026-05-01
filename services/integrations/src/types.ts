export type IntegrationType = "webhook" | "slack" | "teams";
export type SocEventType = "high_severity_detection" | "automated_response_triggered" | "policy_violation" | "suspicious_admin_action" | "trial_expiry_alert";

export interface IntegrationConfig {
  tenantId: string;
  id: string;
  type: IntegrationType;
  endpoint: string;
  enabled: boolean;
  severityThreshold: number;
  eventTypes: SocEventType[];
}

export interface SocEvent {
  eventId: string;
  timestamp: string;
  severity: number;
  eventType: SocEventType;
  projectId: string;
  environment: string;
  summary: string;
  recommendedAction: string;
  consoleDeepLink: string;
}
