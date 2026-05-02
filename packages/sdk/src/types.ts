export type OperatingMode = "observe" | "guard" | "contain" | "emergency";

export type AutomatedAction =
  | "block_request"
  | "challenge_request"
  | "quarantine_session"
  | "revoke_token"
  | "disable_risky_route"
  | "switch_read_only"
  | "notify_operators"
  | "create_immutable_incident";

export interface SecurityEvent {
  route: string;
  method: string;
  sessionId?: string;
  tokenId?: string;
  ip: string;
  userAgent?: string;
  bodySample?: string;
  headers: Record<string, string | undefined>;
  timestamp: string;
}

export interface DetectionResult {
  score: number;
  tags: string[];
  reasons: string[];
  decisionTrace?: { severity: number; reasons: string[]; tags: string[] };
}
