export interface TenantContext { tenantId: string; environment: "prod" | "staging" | "dev"; }
export interface PolicyDecisionRequest { tenant: TenantContext; route: string; method: string; signalTags: string[]; }
export interface PolicyDecisionResponse { allow: boolean; actions: string[]; reason: string; }
export interface DecisionTrace { severity: number; tags: string[]; reasons: string[]; }
export interface ResponsePlan { tenant: TenantContext; actions: string[]; requiresApproval: boolean; }
export interface ActionExecutionResult { action: string; status: "executed" | "skipped"; reason?: string; }
