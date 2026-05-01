export type AutomatedAction =
  | "block_request"
  | "rate_limit_actor"
  | "quarantine_session"
  | "revoke_token"
  | "disable_risky_route"
  | "switch_monitor_only"
  | "switch_read_only"
  | "notify_operators"
  | "create_incident_record";

export type ApprovalAction =
  | "global_logout"
  | "project_wide_lockdown"
  | "maintenance_mode"
  | "service_restart_hook"
  | "credential_rotation_workflow";

export type Action = AutomatedAction | ApprovalAction;

export interface ResponseContext {
  tenantId: string;
  projectId: string;
  environment: string;
  riskScore: number;
  findings: string[];
}

export interface ResponseDecision {
  actions: Action[];
  reason: string;
  cooldownKey: string;
}

export interface SignedRequest {
  action: ApprovalAction;
  projectId: string;
  requestedBy: string;
  signature: string;
}
