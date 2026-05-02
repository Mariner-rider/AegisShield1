import { TenantExportConfig, normalize, enqueue, flush, deadLetters, SiemEventV1 } from "../../../../services/siem-export/src";

const configs = new Map<string, TenantExportConfig>();

export function setSiemConfig(cfg: TenantExportConfig): TenantExportConfig { configs.set(cfg.tenantId, cfg); return cfg; }
export function getSiemConfig(tenantId: string): TenantExportConfig | undefined { return configs.get(tenantId); }

export function streamEvent(tenantId: string, type: SiemEventV1["type"], id: string, payload: Record<string, unknown>, severity?: number): void {
  const cfg = configs.get(tenantId); if (!cfg) return;
  enqueue(cfg, normalize(tenantId, type, id, payload, severity));
}

export async function runScheduledExport(tenantId: string) {
  const cfg = configs.get(tenantId); if (!cfg) return { sent: 0, failed: 0, deadLettered: 0 };
  return flush(cfg, 200);
}

export function getDeadLetters(tenantId: string) { return deadLetters(tenantId); }
