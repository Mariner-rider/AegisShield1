import { ResponseContext, ResponseDecision } from "../types";

export function responsePolicy(ctx: ResponseContext): ResponseDecision {
  const actions: ResponseDecision["actions"] = ["notify_operators", "create_incident_record"];
  if (ctx.findings.includes("ssrf-outbound-abuse") || ctx.findings.includes("path-traversal-injection-heuristics")) actions.push("block_request");
  if (ctx.findings.includes("brute-force-credential-stuffing")) actions.push("rate_limit_actor");
  if (ctx.findings.includes("suspicious-token-reuse")) actions.push("quarantine_session", "revoke_token");
  if (ctx.findings.includes("admin-route-probing")) actions.push("disable_risky_route");
  if (ctx.riskScore >= 90) actions.push("switch_monitor_only");
  return { actions, reason: "defensive response policy", cooldownKey: `${ctx.tenantId}:${ctx.projectId}:${ctx.environment}` };
}
