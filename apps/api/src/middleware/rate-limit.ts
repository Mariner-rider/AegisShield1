const hits = new Map<string, { count: number; ts: number }>();
export function basicRateLimit(key: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.ts > windowMs) { hits.set(key, { count: 1, ts: now }); return true; }
  h.count += 1;
  return h.count <= limit;
}
