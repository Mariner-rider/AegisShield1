export type ExportMethod = "http_push" | "json_batch" | "kafka" | "syslog";
export type ExportDataType = "detection_event" | "response_action" | "audit_log" | "policy_change";

export interface TenantExportConfig {
  tenantId: string;
  method: ExportMethod;
  endpoint?: string;
  topic?: string;
  enabled: boolean;
  dataTypes: ExportDataType[];
  minSeverity?: number;
}

export interface SiemEventV1 {
  schemaVersion: "1.0";
  tenantId: string;
  type: ExportDataType;
  id: string;
  timestamp: string;
  severity?: number;
  payload: Record<string, unknown>;
}

export interface ExportResult { sent: number; failed: number; deadLettered: number; }
