import { SocEvent } from "../types";

export function teamsPayload(e: SocEvent): Record<string, unknown> {
  return {
    "@type": "MessageCard",
    summary: e.summary,
    sections: [{ activityTitle: "AegisShield Alert", facts: [{ name: "Severity", value: String(e.severity) }, { name: "Project", value: `${e.projectId}/${e.environment}` }, { name: "Recommended", value: e.recommendedAction }] }],
    potentialAction: [{ "@type": "OpenUri", name: "Open Console", targets: [{ os: "default", uri: e.consoleDeepLink }] }]
  };
}

export async function sendTeams(endpoint: string, e: SocEvent): Promise<boolean> {
  return endpoint.includes("office.com") && !!teamsPayload(e);
}
