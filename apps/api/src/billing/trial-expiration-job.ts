import { evaluateEntitlements } from "../../../../services/licensing/src";
import { PlanCode, TrialState, UsageMeter } from "../../../../services/billing/src";

export interface TenantRuntimeState {
  tenantId: string;
  plan: PlanCode;
  trial: TrialState;
  usage: UsageMeter;
  enforcementMode: "guard" | "contain" | "observe";
  blockingEnabled: boolean;
}

export function runTrialExpirationJob(states: TenantRuntimeState[]): TenantRuntimeState[] {
  return states.map((s) => {
    const ent = evaluateEntitlements(s.plan, s.trial, s.usage);
    return {
      ...s,
      enforcementMode: ent.monitorOnly ? "observe" : s.enforcementMode,
      blockingEnabled: ent.allowBlocking
    };
  });
}
