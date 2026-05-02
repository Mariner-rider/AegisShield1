export interface SsoAuditEvent { orgId: string; actor: string; event: "login_success" | "login_failure" | "sso_config_changed"; timestamp: string; metadata?: Record<string, unknown>; }
const events: SsoAuditEvent[] = [];
export function recordSsoAudit(e: Omit<SsoAuditEvent, "timestamp">): SsoAuditEvent {
  const ev = { ...e, timestamp: new Date().toISOString() };
  events.push(ev);
  return ev;
}
export function listSsoAudit(orgId: string): SsoAuditEvent[] { return events.filter(e => e.orgId === orgId); }
