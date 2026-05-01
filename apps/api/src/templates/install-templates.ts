import { IntegrationType } from "../onboarding/types";

export function installTemplate(integration: IntegrationType, apiKey: string, token: string): { instructions: string; quickstart: string } {
  if (integration === "node_sdk") {
    return {
      instructions: `1) npm install @aegis/sdk-node\n2) Set AEGIS_API_KEY=${apiKey}\n3) Add middleware to your Express app.`,
      quickstart: `npm i @aegis/sdk-node && export AEGIS_API_KEY=${apiKey} && node server.js`
    };
  }
  if (integration === "reverse_proxy_agent") {
    return {
      instructions: `1) Deploy Aegis agent sidecar\n2) Set AGENT_TOKEN=${token}\n3) Point reverse proxy traffic through sidecar.`,
      quickstart: `docker run -e AGENT_TOKEN=${token} aegis/agent:latest`
    };
  }
  return {
    instructions: `Gateway mode (placeholder): register gateway plugin and configure token ${token}.`,
    quickstart: `echo 'Gateway mode setup coming soon; token: ${token}'`
  };
}
