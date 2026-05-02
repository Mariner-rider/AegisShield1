import Redis from "ioredis";

export type LimitTier = "free" | "pro" | "enterprise";
export type LimitScope = "ip" | "user" | "api_key";

export interface TierConfig {
  windowMs: number;
  maxRequests: number;
  burstCapacity: number;
  refillPerSecond: number;
}

const tierConfigs: Record<LimitTier, Record<LimitScope, TierConfig>> = {
  free: {
    ip: { windowMs: 60_000, maxRequests: 120, burstCapacity: 30, refillPerSecond: 5 },
    user: { windowMs: 60_000, maxRequests: 60, burstCapacity: 15, refillPerSecond: 2 },
    api_key: { windowMs: 60_000, maxRequests: 80, burstCapacity: 20, refillPerSecond: 3 }
  },
  pro: {
    ip: { windowMs: 60_000, maxRequests: 500, burstCapacity: 100, refillPerSecond: 20 },
    user: { windowMs: 60_000, maxRequests: 300, burstCapacity: 60, refillPerSecond: 10 },
    api_key: { windowMs: 60_000, maxRequests: 400, burstCapacity: 80, refillPerSecond: 15 }
  },
  enterprise: {
    ip: { windowMs: 60_000, maxRequests: 2000, burstCapacity: 300, refillPerSecond: 80 },
    user: { windowMs: 60_000, maxRequests: 1500, burstCapacity: 200, refillPerSecond: 50 },
    api_key: { windowMs: 60_000, maxRequests: 1800, burstCapacity: 250, refillPerSecond: 60 }
  }
};

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

export interface RateLimitDecision {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

async function slidingWindowAllow(key: string, cfg: TierConfig): Promise<{ allowed: boolean; count: number }> {
  const now = Date.now();
  const min = now - cfg.windowMs;
  const member = `${now}-${Math.random().toString(36).slice(2)}`;
  const tx = redis.multi();
  tx.zremrangebyscore(key, 0, min);
  tx.zadd(key, now, member);
  tx.zcard(key);
  tx.pexpire(key, cfg.windowMs);
  const out = await tx.exec();
  const count = Number(out?.[2]?.[1] ?? 0);
  return { allowed: count <= cfg.maxRequests, count };
}

async function consumeTokenBucket(key: string, cfg: TierConfig): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds: number }> {
  const now = Date.now();
  const bucketKey = `${key}:bucket`;
  const data = await redis.hmget(bucketKey, "tokens", "lastRefill");
  const tokens = Number(data[0] ?? cfg.burstCapacity);
  const lastRefill = Number(data[1] ?? now);
  const elapsedSeconds = Math.max(0, (now - lastRefill) / 1000);
  const refilled = Math.min(cfg.burstCapacity, tokens + elapsedSeconds * cfg.refillPerSecond);

  if (refilled < 1) {
    const wait = Math.ceil((1 - refilled) / cfg.refillPerSecond);
    await redis.hmset(bucketKey, { tokens: String(refilled), lastRefill: String(now) });
    await redis.pexpire(bucketKey, cfg.windowMs);
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, wait) };
  }

  const next = refilled - 1;
  await redis.hmset(bucketKey, { tokens: String(next), lastRefill: String(now) });
  await redis.pexpire(bucketKey, cfg.windowMs);
  return { allowed: true, remaining: Math.floor(next), retryAfterSeconds: 0 };
}

export async function checkRateLimit(
  scope: LimitScope,
  identity: string,
  tier: LimitTier = "free",
  tenantId = "public"
): Promise<RateLimitDecision> {
  const cfg = tierConfigs[tier][scope];
  const baseKey = `rate:${tenantId}:${tier}:${scope}:${identity}`;

  const bucket = await consumeTokenBucket(baseKey, cfg);
  if (!bucket.allowed) return { allowed: false, retryAfterSeconds: bucket.retryAfterSeconds, remaining: 0 };

  const window = await slidingWindowAllow(`${baseKey}:window`, cfg);
  if (!window.allowed) return { allowed: false, retryAfterSeconds: Math.ceil(cfg.windowMs / 1000), remaining: 0 };

  const remaining = Math.max(0, cfg.maxRequests - window.count);
  return { allowed: true, retryAfterSeconds: 0, remaining };
}

export function resolveTier(subscription?: string): LimitTier {
  if (subscription === "enterprise") return "enterprise";
  if (subscription === "pro") return "pro";
  return "free";
}
