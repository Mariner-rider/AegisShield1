import { ExportResult, SiemEventV1, TenantExportConfig } from "../types";
import { httpPush } from "../adapters/http";
import { jsonFileExport } from "../adapters/json-file";
import { kafkaPublish } from "../adapters/kafka";
import { syslogSend } from "../adapters/syslog";

const dlq: SiemEventV1[] = [];
const queue = new Map<string, SiemEventV1[]>();

export function normalize(tenantId: string, type: SiemEventV1["type"], id: string, payload: Record<string, unknown>, severity?: number): SiemEventV1 {
  return { schemaVersion: "1.0", tenantId, type, id, timestamp: new Date().toISOString(), severity, payload };
}

export function enqueue(config: TenantExportConfig, e: SiemEventV1): void {
  if (e.tenantId !== config.tenantId) return;
  if (!config.enabled || !config.dataTypes.includes(e.type) || (config.minSeverity && (e.severity ?? 0) < config.minSeverity)) return;
  const k = config.tenantId;
  const cur = queue.get(k) ?? [];
  if (cur.length > 5000) return; // backpressure drop in this scaffold
  cur.push(e); queue.set(k, cur);
}

export async function flush(config: TenantExportConfig, batchSize = 100): Promise<ExportResult> {
  const k = config.tenantId; const cur = queue.get(k) ?? [];
  let sent = 0, failed = 0, deadLettered = 0;
  while (cur.length) {
    const batch = cur.splice(0, batchSize);
    const ok = config.method === "http_push" ? await retry(() => httpPush(config.endpoint ?? "", batch))
      : config.method === "json_batch" ? await retry(() => jsonFileExport(config.endpoint ?? "./siem-export.json", batch))
      : config.method === "kafka" ? await retry(() => kafkaPublish(config.topic ?? "aegis.events", batch))
      : await retry(() => syslogSend(config.endpoint ?? "udp://localhost:514", batch));
    if (ok) sent += batch.length;
    else { failed += batch.length; dlq.push(...batch); deadLettered += batch.length; }
  }
  queue.set(k, cur);
  return { sent, failed, deadLettered };
}

async function retry(fn: () => Promise<boolean>, max = 3): Promise<boolean> {
  for (let i = 0; i < max; i++) if (await fn()) return true;
  return false;
}

export function deadLetters(tenantId: string): SiemEventV1[] { return dlq.filter(d => d.tenantId === tenantId); }
