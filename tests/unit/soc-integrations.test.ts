import { describe, it, expect } from "vitest";
import { upsertIntegration, triggerTestEvent } from "../../apps/api/src/integrations/soc-service";
import { deliverEvent } from "../../services/integrations/src";

describe("soc integrations", () => {
  it("delivers filtered events", async () => {
    upsertIntegration({ tenantId: "t1", id: "i1", type: "webhook", endpoint: "https://example.com/hook", enabled: true, severityThreshold: 70, eventTypes: ["high_severity_detection"] });
    const out = await triggerTestEvent("t1", "high_severity_detection");
    expect(out.delivered).toBeGreaterThan(0);
  });

  it("supports dedupe and rate-limit skip path", async () => {
    const cfg = [{ tenantId: "t2", id: "i2", type: "webhook", endpoint: "https://example.com/hook", enabled: true, severityThreshold: 0, eventTypes: ["policy_violation"] as any }];
    const event = { eventId: "e1", timestamp: new Date().toISOString(), severity: 80, eventType: "policy_violation" as any, projectId: "p1", environment: "prod", summary: "x", recommendedAction: "y", consoleDeepLink: "https://x" };
    const first = await deliverEvent(cfg as any, event as any);
    const second = await deliverEvent(cfg as any, event as any);
    expect(first.delivered).toBeGreaterThanOrEqual(1);
    expect(second.skipped).toBeGreaterThanOrEqual(1);
  });
});
