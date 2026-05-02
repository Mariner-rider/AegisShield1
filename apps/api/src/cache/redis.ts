import { createClient } from "redis";

declare global {
  // eslint-disable-next-line no-var
  var __aegisRedis: ReturnType<typeof createClient> | undefined;
}

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
export const redis = global.__aegisRedis ?? createClient({ url: redisUrl });
if (process.env.NODE_ENV !== "production") global.__aegisRedis = redis;

export async function ensureRedisConnection(): Promise<void> {
  if (!redis.isOpen) await redis.connect();
}
