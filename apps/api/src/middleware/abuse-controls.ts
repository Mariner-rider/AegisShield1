import { ensureRedisConnection, redis } from "../cache/redis";

export async function enforceApiRateLimit(ip: string, limit = 120, windowMs = 60_000): Promise<boolean> {
  await ensureRedisConnection();
  const key = `abuse:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) await redis.pExpire(key, windowMs);
  return current <= limit;
}
