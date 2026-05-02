export type WizardStep =
  | "signup"
  | "organization"
  | "project"
  | "integration"
  | "install"
  | "verify"
  | "complete";

export interface WizardState {
  step: WizardStep;
  organizationId?: string;
  projectId?: string;
  integrationType?: "node_sdk" | "reverse_proxy_agent" | "gateway_mode";
  quickstartCommand?: string;
  firstHeartbeat?: boolean;
  firstEvent?: boolean;
  completed?: boolean;
}

export const initialWizardState: WizardState = { step: "signup" };

export function nextStep(s: WizardState): WizardStep {
  if (s.step === "signup") return "organization";
  if (s.step === "organization") return "project";
  if (s.step === "project") return "integration";
  if (s.step === "integration") return "install";
  if (s.step === "install") return "verify";
  if (s.step === "verify") return "complete";
  return "complete";
}
