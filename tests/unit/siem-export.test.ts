import { describe, it, expect } from "vitest";
import { setSiemConfig, streamEvent, runScheduledExport, getDeadLetters } from "../../apps/api/src/siem/service";

describe("siem export", () => {
  it("exports filtered events per tenant", async () => {
    setSiemConfig({ tenantId: "t1", method: "http_push", endpoint: "https://siem.example/hook", enabled: true, dataTypes: ["detection_event"], minSeverity: 70 });
    streamEvent("t1", "detection_event", "e1", { x: 1 }, 80);
    streamEvent("t1", "audit_log", "e2", { x: 1 }, 90);
    const out = await runScheduledExport("t1");
    expect(out.sent).toBe(1);
  });

  it("isolates tenant events and dead letters", async () => {
    setSiemConfig({ tenantId: "t2", method: "http_push", endpoint: "invalid-endpoint", enabled: true, dataTypes: ["policy_change"] });
    streamEvent("t2", "policy_change", "p1", { c: 1 }, 50);
    const out = await runScheduledExport("t2");
    expect(out.deadLettered).toBeGreaterThanOrEqual(1);
    expect(getDeadLetters("t1").every(d => d.tenantId === "t1")).toBe(true);
  });
});
