import { ensureRedisConnection, redis } from "../cache/redis";

export async function createSession(sessionId: string, userId: string, ttlSeconds = 60 * 60 * 24 * 30): Promise<void> {
  await ensureRedisConnection();
  await redis.set(`session:${sessionId}`, userId, { EX: ttlSeconds });
}

export async function validateSession(sessionId: string): Promise<boolean> {
  await ensureRedisConnection();
  return Boolean(await redis.get(`session:${sessionId}`));
}

export async function revokeSession(sessionId: string): Promise<void> {
  await ensureRedisConnection();
  await redis.del(`session:${sessionId}`);
}
