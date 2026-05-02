export type IntelSource = "cisa_kev" | "cisa_advisory" | "dependency_feed" | "manual_ioc";
export type IntelMapType = "ioc_feed" | "denylist_suggestion" | "policy_recommendation" | "vulnerability_watchlist";

export interface RawIntelItem { source: IntelSource; externalId: string; payload: Record<string, any>; observedAt: string; }
export interface NormalizedIntel {
  id: string;
  source: IntelSource;
  externalId: string;
  mapType: IntelMapType;
  value: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  score: number;
  lowRiskAutoApply: boolean;
  observedAt: string;
}

export interface ReviewItem {
  id: string;
  intelId: string;
  recommendation: string;
  impact: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface SignedBundle { version: string; generatedAt: string; payload: NormalizedIntel[]; signature: string; rollbackTo?: string; }
