export type BillingInterval = "monthly" | "annual";
export type SubscriptionState = "trialing" | "active" | "past_due" | "canceled" | "unpaid";

export interface PlanChangeRequest { subscriptionId: string; targetPlan: string; interval: BillingInterval; }
export interface Coupon { code: string; percentOff?: number; amountOffCents?: number; expiresAt?: string; }

export interface InvoiceRecord {
  id: string;
  subscriptionId: string;
  amountCents: number;
  currency: string;
  status: "open" | "paid" | "failed";
  hostedUrl?: string;
  receiptUrl?: string;
  metadata?: Record<string, string>;
}

export interface ProviderSubscription {
  id: string;
  customerId: string;
  plan: string;
  interval: BillingInterval;
  state: SubscriptionState;
  currentPeriodEnd: string;
  cancelAtPeriodEnd?: boolean;
}

export interface BillingProvider {
  name: string;
  createSubscription(customerId: string, plan: string, interval: BillingInterval, coupon?: Coupon): Promise<ProviderSubscription>;
  changePlan(req: PlanChangeRequest): Promise<ProviderSubscription>;
  cancelSubscription(subscriptionId: string, atPeriodEnd: boolean): Promise<ProviderSubscription>;
  listInvoices(customerId: string): Promise<InvoiceRecord[]>;
  verifyWebhook(signature: string, payload: string): boolean;
}
