import { z } from "zod";

export const platformEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AEGIS_MODE: z.enum(["observe", "guard", "contain", "emergency"]).default("guard"),
  AEGIS_SIGNING_KEY: z.string().min(16),
  AEGIS_TENANT_HEADER: z.string().default("x-tenant-id")
});

export type PlatformEnv = z.infer<typeof platformEnvSchema>;
export function parsePlatformEnv(env: Record<string, string | undefined>): PlatformEnv { return platformEnvSchema.parse(env); }
