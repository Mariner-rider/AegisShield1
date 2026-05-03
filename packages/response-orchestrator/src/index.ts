import { AutomatedAction } from "../../sdk/src/types";

export type HighImpactAction =
  | "force_logout_all_users"
  | "restart_service_cluster"
  | "rotate_global_credentials"
  | "maintenance_mode_enablement";

const HIGH_IMPACT = new Set<HighImpactAction>([
  "force_logout_all_users",
  "restart_service_cluster",
  "rotate_global_credentials",
  "maintenance_mode_enablement"
]);

export interface ApprovalProvider { hasValidApproval(action: HighImpactAction): Promise<boolean>; }
export interface ActionExecutor { execute(action: AutomatedAction | HighImpactAction): Promise<void>; }

export async function orchestrate(
  actions: (AutomatedAction | HighImpactAction)[],
  executor: ActionExecutor,
  approval: ApprovalProvider
): Promise<void> {
  for (const action of actions) {
    if (HIGH_IMPACT.has(action as HighImpactAction)) {
      const ok = await approval.hasValidApproval(action as HighImpactAction);
      if (!ok) continue;
    }
    await executor.execute(action);
  }
}
