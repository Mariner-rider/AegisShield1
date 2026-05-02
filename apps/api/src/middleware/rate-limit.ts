const hits = new Map<string, { count: number; ts: number }>();

function pruneExpired(windowMs: number, now: number): void {
  for (const [key, value] of hits) {
    if (now - value.ts > windowMs) {
      hits.delete(key);
    }
  }
}

export function basicRateLimit(key: string, limit = 20, windowMs = 60_000, maxEntries = 10_000): boolean {
  const now = Date.now();
  if (hits.size > maxEntries) {
    pruneExpired(windowMs, now);
  }

  const h = hits.get(key);
  if (!h || now - h.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
    return true;
  }

  h.count += 1;
  return h.count <= limit;
}
