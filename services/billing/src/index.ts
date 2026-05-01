export type PlanCode = "starter" | "growth" | "business" | "enterprise";
export type CredentialStatus = "active" | "trial_active" | "trial_expired" | "suspended" | "revoked";

export interface SubscriptionPlanDef {
  code: PlanCode;
  monthlyUsdCents: number;
  includedSeats: number;
  maxProtectedApps: number;
  allowBlockingAfterTrial: boolean;
}

export interface TrialState {
  startsAt: string;
  endsAt: string;
  graceEndsAt: string;
  convertedAt?: string;
}

export interface UsageMeter {
  requestsInspected: number;
  eventsProcessed: number;
  protectedApps: number;
  seatsUsed: number;
}

export const PLAN_DEFS: Record<PlanCode, SubscriptionPlanDef> = {
  starter: { code: "starter", monthlyUsdCents: 4900, includedSeats: 3, maxProtectedApps: 3, allowBlockingAfterTrial: false },
  growth: { code: "growth", monthlyUsdCents: 14900, includedSeats: 10, maxProtectedApps: 15, allowBlockingAfterTrial: true },
  business: { code: "business", monthlyUsdCents: 49900, includedSeats: 25, maxProtectedApps: 75, allowBlockingAfterTrial: true },
  enterprise: { code: "enterprise", monthlyUsdCents: 0, includedSeats: 1000, maxProtectedApps: 10000, allowBlockingAfterTrial: true }
};

export interface BillingProvider {
  createSubscription(orgId: string, plan: PlanCode): { subscriptionId: string; status: string };
  markConverted(subscriptionId: string): void;
}

export class MockBillingProvider implements BillingProvider {
  private state = new Map<string, string>();
  createSubscription(orgId: string, plan: PlanCode) { const id = `${orgId}-${plan}`; this.state.set(id, "trialing"); return { subscriptionId: id, status: "trialing" }; }
  markConverted(subscriptionId: string) { this.state.set(subscriptionId, "active"); }
}

export function startTrial(now = new Date()): TrialState {
  const startsAt = now.toISOString();
  const endsAt = new Date(now.getTime() + 30 * 86400000).toISOString();
  const graceEndsAt = new Date(now.getTime() + 37 * 86400000).toISOString();
  return { startsAt, endsAt, graceEndsAt };
}

export function trialStatus(trial: TrialState, now = new Date()): "trial_active" | "trial_expired" | "grace" | "converted" {
  if (trial.convertedAt) return "converted";
  if (now <= new Date(trial.endsAt)) return "trial_active";
  if (now <= new Date(trial.graceEndsAt)) return "grace";
  return "trial_expired";
}
