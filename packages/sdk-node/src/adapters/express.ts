import { PlatformClient } from "../core/client";
import { SDKConfig, RouteMetadata } from "../core/types";

export function expressAegisMiddleware(client: PlatformClient, config: SDKConfig, meta?: RouteMetadata) {
  return async (req: any, res: any, next: any) => {
    try {
      const policy = await client.fetchPolicy();
      const monitorOnly = config.enforcementMode === "monitor_only" || policy.monitorOnly;
      client.queueEvent({ path: req.path, method: req.method, routeMeta: meta, timestamp: new Date().toISOString() });
      if (!policy.allow && !monitorOnly) return res.status(403).json({ blocked: true, reason: policy.reason });
      res.on?.("finish", () => client.queueEvent({ path: req.path, method: req.method, status: res.statusCode, routeMeta: meta, timestamp: new Date().toISOString() }));
      return next();
    } catch (_e) {
      if (config.failureMode === "fail_closed") return res.status(503).json({ blocked: true, reason: "policy unavailable" });
      return next();
    }
  };
}
