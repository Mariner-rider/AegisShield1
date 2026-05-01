export type IntegrationType = "node_sdk" | "reverse_proxy_agent" | "gateway_mode";

export interface OnboardingState {
  userId: string;
  organizationId?: string;
  projectId?: string;
  integrationType?: IntegrationType;
  installInstructions?: string;
  quickstartCommand?: string;
  trialApiKeyId?: string;
  trialAgentTokenId?: string;
  firstHeartbeatAt?: string;
  firstEventAt?: string;
  completedAt?: string;
}
