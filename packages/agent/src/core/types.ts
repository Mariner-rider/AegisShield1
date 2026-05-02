export interface AgentConfig {
  platformUrl: string;
  enrollmentToken: string;
  environmentId: string;
  heartbeatIntervalSec: number;
}

export interface AgentState {
  enrolled: boolean;
  bindingId?: string;
  lastHeartbeatAt?: string;
  lastPolicyVersion?: string;
  health: "starting" | "healthy" | "degraded";
}
