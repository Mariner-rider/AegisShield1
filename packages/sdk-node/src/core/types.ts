export type FailureMode = "fail_open" | "fail_closed";
export type EnforcementMode = "monitor_only" | "guard";

export interface SDKConfig {
  platformUrl: string;
  apiKey: string;
  tenantId: string;
  environment: string;
  failureMode: FailureMode;
  enforcementMode: EnforcementMode;
  batchSize?: number;
}

export interface RouteMetadata { service: string; routeName: string; tags?: string[]; }
export interface SecurityEvent { path: string; method: string; status?: number; routeMeta?: RouteMetadata; timestamp: string; }
export interface PolicyDecision { allow: boolean; reason: string; monitorOnly?: boolean; }
