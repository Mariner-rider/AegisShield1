export interface BillingPlan { id: string; name: string; monthlyUsd: number; }
export interface TenantSubscription { tenantId: string; planId: string; status: "active" | "past_due" | "canceled"; }
