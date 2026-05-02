import { describe, it, expect } from "vitest";
import { ApprovalWorkflow } from "../../services/responder/src/approval/workflow";
import { ResponseAuditLog } from "../../services/responder/src/audit/immutable";
import { ResponderService } from "../../services/responder/src";

describe("responder orchestration", () => {
  it("enforces approval-required actions and blast radius", () => {
    const approvals = new ApprovalWorkflow("key");
    const audit = new ResponseAuditLog();
    const svc = new ResponderService(approvals, audit);
    const key = "t1:p1:prod";

    const out = svc.execute(["notify_operators", "project_wide_lockdown"], "actor", key);
    expect(out).toContain("notify_operators");
    expect(out).not.toContain("project_wide_lockdown");
  });

  it("accepts signed and approved high-impact action", () => {
    const approvals = new ApprovalWorkflow("key");
    const audit = new ResponseAuditLog();
    const svc = new ResponderService(approvals, audit);
    const key = "t1:p1:prod";
    approvals.approve(key, "maintenance_mode", "ops", new Date(Date.now() + 60000).toISOString());
    const out = svc.execute(["maintenance_mode"], "project", key);
    expect(out).toContain("maintenance_mode");
  });

  it("supports rollback and immutable audit chain", () => {
    const approvals = new ApprovalWorkflow("key");
    const audit = new ResponseAuditLog();
    const svc = new ResponderService(approvals, audit);
    const rollbacks = svc.rollback(["disable_risky_route", "switch_monitor_only"], "k1");
    expect(rollbacks).toContain("rollback_disable_risky_route");
    const entries = audit.entries();
    expect(entries.length).toBeGreaterThan(0);
  });
});
