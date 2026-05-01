import { EnrichedAlert, RawSignal } from "./types";
import { templateFor } from "./templates";
import { enrichMetadata, ipIntel } from "./enrichment";

const alerts = new Map<string, EnrichedAlert>();
const groupCounter = new Map<string, number>();

function groupId(r: RawSignal): string { return `${r.tenantId}:${r.projectId}:${r.kind}:${r.route}:${r.ip}`; }

export function createAlert(r: RawSignal): EnrichedAlert {
  const t = templateFor(r.kind);
  const gid = groupId(r);
  const count = (groupCounter.get(gid) ?? 0) + 1;
  groupCounter.set(gid, count);
  const escalated = r.severity >= 85 && count >= 3;
  const alert: EnrichedAlert = {
    groupId: gid,
    alertId: r.alertId,
    kind: r.kind,
    severity: r.severity,
    summary: t.summary,
    playbook: { whatHappened: t.whatHappened, whyItMatters: t.whyItMatters, nextStep: t.nextStep },
    ipIntel: ipIntel(r.ip),
    routeInfo: { route: r.route, method: r.requestMeta.method },
    requestMetadata: enrichMetadata(r),
    acknowledged: false,
    escalated,
    timestamp: r.timestamp
  };
  alerts.set(alert.alertId, alert);
  return alert;
}

export function acknowledgeAlert(alertId: string): EnrichedAlert | undefined {
  const a = alerts.get(alertId); if (!a) return undefined; a.acknowledged = true; return a;
}

export function listByGroup(group: string): EnrichedAlert[] { return [...alerts.values()].filter(a => a.groupId === group); }
