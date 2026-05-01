export type AlertKind = "brute_force_detected" | "suspicious_token_reuse" | "ssrf_attempt" | "admin_endpoint_probing";

export interface RawSignal {
  alertId: string;
  tenantId: string;
  projectId: string;
  environment: string;
  kind: AlertKind;
  severity: number;
  route: string;
  ip: string;
  requestMeta: Record<string, string | undefined>;
  bodySample?: string;
  timestamp: string;
}

export interface EnrichedAlert {
  groupId: string;
  alertId: string;
  kind: AlertKind;
  severity: number;
  summary: string;
  playbook: { whatHappened: string; whyItMatters: string; nextStep: string; };
  ipIntel: { reputation: "low" | "medium" | "high"; asn: string; geoHint: string };
  routeInfo: { route: string; method?: string };
  requestMetadata: Record<string, string>;
  acknowledged: boolean;
  escalated: boolean;
  timestamp: string;
}
