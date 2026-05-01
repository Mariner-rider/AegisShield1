import { ApprovalWorkflow } from "./approval/workflow";
import { responsePolicy } from "./policy/engine";
import { ResponseAuditLog } from "./audit/immutable";
import { Action, ApprovalAction, ResponseContext } from "./types";

const approvalRequired = new Set<ApprovalAction>([
  "global_logout",
  "project_wide_lockdown",
  "maintenance_mode",
  "service_restart_hook",
  "credential_rotation_workflow"
]);

export class ResponderService {
  private cooldown = new Map<string, number>();
  private readonly cooldownMs = 30_000;
  constructor(private readonly approvals: ApprovalWorkflow, private readonly audit: ResponseAuditLog) {}

  decide(ctx: ResponseContext) { return responsePolicy(ctx); }

  execute(actions: Action[], blastRadius: "actor" | "project" | "tenant", key: string): Action[] {
    const now = Date.now();
    if ((this.cooldown.get(key) ?? 0) > now) return [];
    this.cooldown.set(key, now + this.cooldownMs);
    const allowed: Action[] = [];
    for (const a of actions) {
      if (approvalRequired.has(a as ApprovalAction) && !this.approvals.hasValidApproval(key, a as ApprovalAction)) continue;
      if (blastRadius === "actor" && ["project_wide_lockdown", "maintenance_mode"].includes(a)) continue;
      allowed.push(a);
      this.audit.append(a, { key, blastRadius });
    }
    return allowed;
  }

  rollback(lastActions: Action[], key: string): string[] {
    const rollbacks = lastActions.map((a) => `rollback_${a}`);
    for (const r of rollbacks) this.audit.append(r, { key });
    return rollbacks;
  }
}
