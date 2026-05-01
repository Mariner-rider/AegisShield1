import { PlatformClient } from "../core/client";
import { SDKConfig, RouteMetadata } from "../core/types";

export function fastifyAegisHook(client: PlatformClient, config: SDKConfig, meta?: RouteMetadata) {
  return {
    preHandler: async (req: any, reply: any) => {
      try {
        const policy = await client.fetchPolicy();
        client.queueEvent({ path: req.url, method: req.method, routeMeta: meta, timestamp: new Date().toISOString() });
        const monitorOnly = config.enforcementMode === "monitor_only" || policy.monitorOnly;
        if (!policy.allow && !monitorOnly) return reply.code(403).send({ blocked: true, reason: policy.reason });
      } catch (_e) {
        if (config.failureMode === "fail_closed") return reply.code(503).send({ blocked: true, reason: "policy unavailable" });
      }
    },
    onResponse: async (req: any, reply: any) => {
      client.queueEvent({ path: req.url, method: req.method, status: reply.statusCode, routeMeta: meta, timestamp: new Date().toISOString() });
    }
  };
}
