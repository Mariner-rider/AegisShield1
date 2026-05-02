import { checkRateLimit, resolveTier } from "./rate-limit";

export async function enforceApiRateLimit(ip: string, tenantId?: string, subscriptionTier?: string): Promise<{ ok: boolean; retryAfter: number }> {
  const tier = resolveTier(subscriptionTier);
  const decision = await checkRateLimit("ip", ip, tier, tenantId ?? "public");
  return { ok: decision.allowed, retryAfter: decision.retryAfterSeconds };
}
