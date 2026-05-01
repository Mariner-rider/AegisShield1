import { RawSignal } from "./types";

function redact(v?: string): string {
  if (!v) return "";
  return v.replace(/(token|secret|password)=([^&\s]+)/gi, "$1=REDACTED").replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "REDACTED_EMAIL");
}

export function enrichMetadata(r: RawSignal): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(r.requestMeta)) out[k.toLowerCase()] = redact(v);
  if (r.bodySample) out.bodySample = redact(r.bodySample).slice(0, 200);
  return out;
}

export function ipIntel(ip: string) {
  const high = ip.startsWith("203.") || ip.startsWith("198.");
  return { reputation: (high ? "high" : "medium") as const, asn: high ? "AS64500" : "AS64496", geoHint: high ? "Unknown/External" : "Regional ISP" };
}
