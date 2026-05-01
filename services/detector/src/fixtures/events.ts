import { IngestedRequestEvent } from "../types";

export const fixtureEvents: IngestedRequestEvent[] = [
  { tenantId: "t1", projectId: "p1", environment: "prod", route: "/login", method: "POST", status: 401, ip: "10.0.0.1", timestamp: new Date().toISOString() },
  { tenantId: "t1", projectId: "p1", environment: "prod", route: "/admin/config", method: "GET", ip: "10.0.0.2", timestamp: new Date().toISOString() },
  { tenantId: "t1", projectId: "p1", environment: "prod", route: "/fetch", method: "POST", ip: "10.0.0.3", outboundHost: "169.254.169.254", timestamp: new Date().toISOString() }
];
