import { z } from "zod";
import { SDKConfig } from "./types";

const schema = z.object({
  AEGIS_PLATFORM_URL: z.string().url(),
  AEGIS_API_KEY: z.string().min(12),
  AEGIS_TENANT_ID: z.string().min(1),
  AEGIS_ENVIRONMENT: z.string().min(1),
  AEGIS_FAILURE_MODE: z.enum(["fail_open", "fail_closed"]).default("fail_open"),
  AEGIS_ENFORCEMENT_MODE: z.enum(["monitor_only", "guard"]).default("guard")
});

export function loadConfig(env: Record<string, string | undefined>): SDKConfig {
  const e = schema.parse(env);
  return {
    platformUrl: e.AEGIS_PLATFORM_URL,
    apiKey: e.AEGIS_API_KEY,
    tenantId: e.AEGIS_TENANT_ID,
    environment: e.AEGIS_ENVIRONMENT,
    failureMode: e.AEGIS_FAILURE_MODE,
    enforcementMode: e.AEGIS_ENFORCEMENT_MODE,
    batchSize: 50
  };
}
