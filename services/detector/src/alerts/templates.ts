import { AlertKind } from "./types";

export function templateFor(kind: AlertKind) {
  if (kind === "brute_force_detected") return {
    summary: "Brute force / credential stuffing behavior detected",
    whatHappened: "Repeated failed authentication patterns from a source.",
    whyItMatters: "Can lead to account takeover and service abuse.",
    nextStep: "Enable challenge/rate limits and review affected accounts."
  };
  if (kind === "suspicious_token_reuse") return {
    summary: "Suspicious token reuse detected",
    whatHappened: "A token appears reused across different client contexts.",
    whyItMatters: "May indicate token theft or replay.",
    nextStep: "Revoke token and force re-authentication for impacted session."
  };
  if (kind === "ssrf_attempt") return {
    summary: "Potential SSRF attempt detected",
    whatHappened: "Request indicators target internal/metadata endpoints.",
    whyItMatters: "Could expose credentials or internal infrastructure.",
    nextStep: "Block request and verify outbound allowlist controls."
  };
  return {
    summary: "Admin endpoint probing detected",
    whatHappened: "Repeated access attempts to administrative paths.",
    whyItMatters: "May indicate reconnaissance for privilege escalation.",
    nextStep: "Require strong auth controls and investigate source behavior."
  };
}
