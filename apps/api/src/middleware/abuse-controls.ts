const ipHits = new Map<string, { n: number; ts: number }>();

function pruneExpired(windowMs: number, now: number): void {
  for (const [key, value] of ipHits) {
    if (now - value.ts > windowMs) {
      ipHits.delete(key);
    }
  }
}

export function enforceApiRateLimit(ip: string, limit = 120, windowMs = 60_000, maxEntries = 20_000): boolean {
  const now = Date.now();
  if (ipHits.size > maxEntries) {
    pruneExpired(windowMs, now);
  }

  const h = ipHits.get(ip);
  if (!h || now - h.ts > windowMs) {
    ipHits.set(ip, { n: 1, ts: now });
    return true;
  }

  h.n += 1;
  return h.n <= limit;
}
