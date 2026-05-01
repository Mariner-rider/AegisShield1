import { describe, it, expect } from "vitest";
import { PolicyRegistry } from "../../services/policy-service/src";
import { ImmutableAuditLog } from "../../services/audit-service/src";
import { ApprovalStore } from "../../services/control-plane/src";

describe("security services", () => {
  it("signs verifies and rolls back bundle", () => {
    const reg = new PolicyRegistry("secret-key");
    const v1 = reg.signAndStore({ version: "v1.0.0", createdAt: new Date().toISOString(), rules: [{ id: "r1", description: "d rule", priority: 1, conditions: [{ field: "route", operator: "eq", value: "/login" }], actions: ["challenge_request"] }] });
    reg.signAndStore({ version: "v1.0.1", createdAt: new Date().toISOString(), rules: [{ id: "r2", description: "d rule", priority: 1, conditions: [{ field: "route", operator: "eq", value: "/admin" }], actions: ["block_request"] }] });
    expect(reg.verify(v1)).toBe(true);
    expect(reg.rollback("v1.0.0").bundle.version).toBe("v1.0.0");
  });

  it("creates immutable audit chain", () => {
    const log = new ImmutableAuditLog();
    const a = log.append({ event: "x" });
    const b = log.append({ event: "y" });
    expect(b.previousHash).toBe(a.eventHash);
  });

  it("checks approval validity", () => {
    const store = new ApprovalStore();
    store.add({ id: "1", action: "restart_service_cluster", requestedBy: "sec", approver: "ops", reason: "incident", approvedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString() });
    expect(store.valid("restart_service_cluster")).toBe(true);
  });
});
