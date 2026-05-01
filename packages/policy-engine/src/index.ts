import { DetectionResult, OperatingMode, AutomatedAction, SecurityEvent } from "../../sdk/src/types";

export interface PolicyDecision { allow: boolean; actions: AutomatedAction[]; reason: string; }
export interface PolicyInput { mode: OperatingMode; event: SecurityEvent; detection: DetectionResult; }
export interface PolicyEngine { evaluate(input: PolicyInput): PolicyDecision; }

export class EmbeddedPolicyEngine implements PolicyEngine {
  evaluate(input: PolicyInput): PolicyDecision {
    const t = input.detection.tags;
    if (input.mode === "observe") return { allow: true, actions: ["notify_operators"], reason: "observe mode" };
    if (t.includes("ssrf") || t.includes("injection_pattern")) return { allow: false, actions: ["block_request", "create_immutable_incident"], reason: "critical injection-like pattern" };
    if (t.includes("brute_force") || t.includes("bot_scrape_burst")) return { allow: false, actions: ["challenge_request", "notify_operators"], reason: "abuse traffic" };
    if (t.includes("access_control_violation") || t.includes("suspicious_token_reuse")) return { allow: false, actions: ["quarantine_session", "revoke_token", "create_immutable_incident"], reason: "account takeover risk" };
    if (input.mode === "emergency" && input.event.method !== "GET") return { allow: false, actions: ["switch_read_only", "disable_risky_route", "notify_operators"], reason: "emergency safeguards" };
    return { allow: true, actions: [], reason: "default allow" };
  }
}
