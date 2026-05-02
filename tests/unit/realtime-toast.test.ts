import { describe, expect, it } from "vitest";
import { toToast } from "../../apps/console-web/src/realtime/toast";

describe("realtime toast", () => {
  it("creates toast for critical/high events", () => {
    expect(toToast({ type: "attack_event", tenantId: "t1", severity: "critical" })?.variant).toBe("critical");
    expect(toToast({ type: "attack_event", tenantId: "t1", severity: "high" })?.variant).toBe("warning");
    expect(toToast({ type: "attack_event", tenantId: "t1", severity: "low" })).toBeNull();
  });
});
