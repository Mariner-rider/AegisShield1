export interface IngestedRequestEvent {
  tenantId: string;
  projectId: string;
  environment: "dev" | "staging" | "prod";
  route: string;
  method: string;
  status?: number;
  ip: string;
  tokenId?: string;
  userId?: string;
  userAgent?: string;
  bodySample?: string;
  outboundHost?: string;
  timestamp: string;
}

export interface DetectionFinding {
  pack: string;
  ruleId: string;
  ruleVersion: string;
  confidence: number;
  severity: number;
  recommendation: string;
  responseCandidate?: "challenge_request" | "quarantine_session" | "block_request" | "notify_operators";
  decisionTrace: string[];
}

export interface DetectionEvent {
  tenantId: string;
  projectId: string;
  environment: "dev" | "staging" | "prod";
  sourceEventAt: string;
  findings: DetectionFinding[];
  suppressed: boolean;
}
