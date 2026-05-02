import { createHash } from "node:crypto";
import { NormalizedIntel, RawIntelItem } from "../types";

export function normalize(raw: RawIntelItem): NormalizedIntel {
  const mapType = raw.source === "manual_ioc" || raw.payload.tags?.includes?.("ioc") ? "ioc_feed" : raw.source === "dependency_feed" ? "vulnerability_watchlist" : "policy_recommendation";
  const severity = (raw.payload.severity ?? "medium") as NormalizedIntel["severity"];
  const confidence = raw.source === "cisa_kev" ? 0.95 : raw.source === "manual_ioc" ? 0.8 : 0.7;
  const score = Math.round(confidence * (severity === "critical" ? 100 : severity === "high" ? 80 : severity === "medium" ? 60 : 40));
  const value = raw.payload.cve ?? raw.payload.value ?? raw.externalId;
  const lowRiskAutoApply = ["ioc_feed", "denylist_suggestion"].includes(mapType) || severity === "low";
  const id = createHash("sha256").update(`${raw.source}:${raw.externalId}:${value}`).digest("hex");
  return { id, source: raw.source, externalId: raw.externalId, mapType: mapType as any, value, severity, confidence, score, lowRiskAutoApply, observedAt: raw.observedAt };
}

export function dedupe(items: NormalizedIntel[]): NormalizedIntel[] {
  const seen = new Map<string, NormalizedIntel>();
  for (const i of items) if (!seen.has(i.id)) seen.set(i.id, i);
  return [...seen.values()];
}
