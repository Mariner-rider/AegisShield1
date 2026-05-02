import { ensureRedisConnection, redis } from "../cache/redis";

export async function basicRateLimit(key: string, limit = 20, windowMs = 60_000): Promise<boolean> {
  await ensureRedisConnection();
  const redisKey = `rl:${key}`;
  const current = await redis.incr(redisKey);
  if (current === 1) await redis.pExpire(redisKey, windowMs);
  return current <= limit;
}
