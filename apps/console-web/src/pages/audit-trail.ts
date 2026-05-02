export interface AuditTrailEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  immutableHash: string;
}

export const auditTrailPage = {
  id: "audit-trail",
  title: "Audit Trail",
  route: "/audit-trail",
  immutableLogViewer: true,
  supportsSearch: true,
  supportsDateRange: true,
  exportFormats: ["csv", "json", "ndjson"],
  columns: ["timestamp", "actor", "action", "target", "immutableHash"],
  events: [] as AuditTrailEvent[]
};
