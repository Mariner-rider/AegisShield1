import { describe, it, expect } from "vitest";
import { createAlert, acknowledgeAlert, listByGroup } from "../../services/detector/src/alerts";

describe("alert playbooks", () => {
  it("creates structured alert with playbook and enrichment", () => {
    const a = createAlert({
      alertId: "a1", tenantId: "t1", projectId: "p1", environment: "prod", kind: "ssrf_attempt", severity: 90,
      route: "/fetch", ip: "203.0.113.10", requestMeta: { method: "POST", authorization: "Bearer secret=abc" }, bodySample: "email=test@example.com", timestamp: new Date().toISOString()
    });
    expect(a.playbook.nextStep).toContain("allowlist");
    expect(a.requestMetadata.authorization).toContain("REDACTED");
  });

  it("supports acknowledge, grouping, and escalation", () => {
    const base = { tenantId: "t2", projectId: "p2", environment: "prod" as const, kind: "brute_force_detected" as const, severity: 90, route: "/login", ip: "198.51.100.1", requestMeta: { method: "POST" }, timestamp: new Date().toISOString() };
    const a1 = createAlert({ ...base, alertId: "g1" });
    createAlert({ ...base, alertId: "g2" });
    const a3 = createAlert({ ...base, alertId: "g3" });
    expect(a3.escalated).toBe(true);
    acknowledgeAlert(a1.alertId);
    expect(listByGroup(a1.groupId).length).toBeGreaterThanOrEqual(3);
  });
});
