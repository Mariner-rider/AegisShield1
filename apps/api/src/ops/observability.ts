export interface TraceContext { traceId: string; spanId: string; tenantId?: string; }
export function withTraceCorrelation(log: Record<string, unknown>, trace: TraceContext) {
  return { ...log, traceId: trace.traceId, spanId: trace.spanId, tenantId: trace.tenantId };
}
export const metrics = {
  requests_total: "counter",
  auth_rate_limit_hits_total: "counter",
  detection_events_total: "counter",
  response_actions_total: "counter"
};
export const otelHints = { serviceName: "aegis-api", exporter: "otlp", propagation: "tracecontext" };
