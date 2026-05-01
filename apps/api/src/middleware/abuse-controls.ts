const ipHits = new Map<string, { n: number; ts: number }>();
export function enforceApiRateLimit(ip: string, limit = 120, windowMs = 60_000): boolean {
  const now = Date.now();
  const h = ipHits.get(ip);
  if (!h || now - h.ts > windowMs) { ipHits.set(ip, { n: 1, ts: now }); return true; }
  h.n += 1;
  return h.n <= limit;
}
