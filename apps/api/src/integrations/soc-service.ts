import { IntegrationConfig, SocEvent, deliverEvent, SocEventType } from "../../../../services/integrations/src";

const store = new Map<string, IntegrationConfig[]>();

export function upsertIntegration(cfg: IntegrationConfig): IntegrationConfig {
  const cur = store.get(cfg.tenantId) ?? [];
  const next = [...cur.filter(c => c.id !== cfg.id), cfg];
  store.set(cfg.tenantId, next);
  return cfg;
}

export function listIntegrations(tenantId: string): IntegrationConfig[] { return store.get(tenantId) ?? []; }

export async function triggerTestEvent(tenantId: string, type: SocEventType = "high_severity_detection") {
  const event: SocEvent = {
    eventId: `evt-${Date.now()}`,
    timestamp: new Date().toISOString(),
    severity: 85,
    eventType: type,
    projectId: "project_demo",
    environment: "prod",
    summary: "Test SOC alert from AegisShield",
    recommendedAction: "Review event and validate response policy",
    consoleDeepLink: `https://console.aegis.local/t/${tenantId}/events`
  };
  return deliverEvent(listIntegrations(tenantId), event);
}
