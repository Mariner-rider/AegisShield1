export interface TelemetryClient {
  trace(name: string, attrs?: Record<string, string | number>): void;
  metric(name: string, value: number, labels?: Record<string, string>): void;
  log(level: "info" | "warn" | "error", msg: string, ctx?: Record<string, unknown>): void;
}
