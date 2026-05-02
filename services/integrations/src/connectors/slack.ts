import { SocEvent } from "../types";

export function slackPayload(e: SocEvent): Record<string, unknown> {
  return {
    text: `AegisShield Alert: ${e.summary}`,
    blocks: [{ type: "section", text: { type: "mrkdwn", text: `*Severity:* ${e.severity}\n*Project:* ${e.projectId}/${e.environment}\n*Action:* ${e.recommendedAction}\n<${e.consoleDeepLink}|Open in console>` } }]
  };
}

export async function sendSlack(endpoint: string, e: SocEvent): Promise<boolean> {
  return endpoint.includes("hooks.slack.com") && !!slackPayload(e);
}
