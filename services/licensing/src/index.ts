import { CredentialStatus, PLAN_DEFS, PlanCode, TrialState, trialStatus, UsageMeter } from "../../billing/src";

export interface Entitlements {
  monitorOnly: boolean;
  allowBlocking: boolean;
  dashboardAccess: boolean;
  maxProtectedApps: number;
  maxSeats: number;
}

export function evaluateEntitlements(plan: PlanCode, trial: TrialState, usage: UsageMeter): Entitlements {
  const p = PLAN_DEFS[plan];
  const t = trialStatus(trial);
  const withinUsage = usage.protectedApps <= p.maxProtectedApps && usage.seatsUsed <= p.includedSeats;

  if (t === "trial_active") {
    return { monitorOnly: false, allowBlocking: true, dashboardAccess: true, maxProtectedApps: p.maxProtectedApps, maxSeats: p.includedSeats };
  }
  if (t === "grace") {
    return {
      monitorOnly: !p.allowBlockingAfterTrial || !withinUsage,
      allowBlocking: p.allowBlockingAfterTrial && withinUsage,
      dashboardAccess: true,
      maxProtectedApps: p.maxProtectedApps,
      maxSeats: p.includedSeats
    };
  }
  if (t === "trial_expired") {
    return { monitorOnly: true, allowBlocking: false, dashboardAccess: true, maxProtectedApps: p.maxProtectedApps, maxSeats: p.includedSeats };
  }
  return { monitorOnly: false, allowBlocking: true, dashboardAccess: true, maxProtectedApps: p.maxProtectedApps, maxSeats: p.includedSeats };
}

export function credentialStatus(base: "active" | "suspended" | "revoked", trial: TrialState): CredentialStatus {
  if (base === "revoked") return "revoked";
  if (base === "suspended") return "suspended";
  const t = trialStatus(trial);
  if (t === "trial_active") return "trial_active";
  if (t === "trial_expired") return "trial_expired";
  return "active";
}
