import { SiemEventV1 } from "../types";
export function toSyslogLine(e: SiemEventV1): string { return `<134>1 ${e.timestamp} aegis siem - - - ${JSON.stringify({ id: e.id, type: e.type, tenantId: e.tenantId, severity: e.severity })}`; }
export async function syslogSend(_endpoint: string, batch: SiemEventV1[]): Promise<boolean> { return batch.every(Boolean); }
