import { describe, it, expect } from "vitest";
import { PLAN_DEFS, startTrial, trialStatus } from "../../../services/billing/src";
import { credentialStatus, evaluateEntitlements } from "../../../services/licensing/src";
import { runTrialExpirationJob } from "../src/billing/trial-expiration-job";
import { UsageMeterStore } from "../src/billing/metering";

describe("licensing and billing", () => {
  it("has required plans", () => {
    expect(Object.keys(PLAN_DEFS)).toEqual(["starter", "growth", "business", "enterprise"]);
  });

  it("trial lifecycle active -> expired with grace", () => {
    const t = startTrial(new Date("2026-01-01T00:00:00.000Z"));
    expect(trialStatus(t, new Date("2026-01-10T00:00:00.000Z"))).toBe("trial_active");
    expect(trialStatus(t, new Date("2026-02-02T00:00:00.000Z"))).toBe("grace");
    expect(trialStatus(t, new Date("2026-02-20T00:00:00.000Z"))).toBe("trial_expired");
  });

  it("falls back to monitor-only when trial expired", () => {
    const trial = startTrial(new Date("2026-01-01T00:00:00.000Z"));
    const s = runTrialExpirationJob([{
      tenantId: "t1", plan: "starter", trial, usage: { requestsInspected: 1, eventsProcessed: 1, protectedApps: 1, seatsUsed: 1 },
      enforcementMode: "guard", blockingEnabled: true
    }])[0];
    const after = runTrialExpirationJob([{ ...s, trial: { ...trial, endsAt: "2026-01-02T00:00:00.000Z", graceEndsAt: "2026-01-03T00:00:00.000Z" } }])[0];
    expect(after.enforcementMode).toBe("observe");
    expect(after.blockingEnabled).toBe(false);
  });

  it("credential status mapping", () => {
    const trial = startTrial();
    expect(credentialStatus("active", trial)).toBe("trial_active");
    expect(credentialStatus("suspended", trial)).toBe("suspended");
    expect(credentialStatus("revoked", trial)).toBe("revoked");
  });

  it("usage metering tracks counters", () => {
    const m = new UsageMeterStore();
    m.incRequests("t1", 10); m.incEvents("t1", 3); m.setProtectedApps("t1", 2); m.setSeats("t1", 4);
    expect(m.get("t1").requestsInspected).toBe(10);
    expect(m.get("t1").eventsProcessed).toBe(3);
  });

  it("entitlement checks", () => {
    const trial = startTrial(new Date("2026-01-01T00:00:00.000Z"));
    const e = evaluateEntitlements("growth", trial, { requestsInspected: 0, eventsProcessed: 0, protectedApps: 1, seatsUsed: 1 });
    expect(e.allowBlocking).toBe(true);
  });
});
