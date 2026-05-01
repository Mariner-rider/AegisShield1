export interface GatewayAdapter {
  onRequest(event: Record<string, unknown>): Promise<void>;
  onResponse(event: Record<string, unknown>): Promise<void>;
}

export interface SidecarAgentConfig { tenantHeader: string; mode: "observe" | "guard" | "contain" | "emergency"; }
