import { MockPayProvider, SubscriptionStateStore, handleBillingWebhook, Coupon } from "../../../../services/billing/src";

const provider = new MockPayProvider("whsec_demo");
const syncStore = new SubscriptionStateStore();

export async function createOrConvertSubscription(customerId: string, plan: string, interval: "monthly"|"annual", coupon?: Coupon) {
  return provider.createSubscription(customerId, plan, interval, coupon);
}

export async function changeSubscriptionPlan(subscriptionId: string, targetPlan: string, interval: "monthly"|"annual") {
  return provider.changePlan({ subscriptionId, targetPlan, interval });
}

export async function cancelSubscription(subscriptionId: string, atPeriodEnd = true) {
  return provider.cancelSubscription(subscriptionId, atPeriodEnd);
}

export async function listBillingInvoices(customerId: string) { return provider.listInvoices(customerId); }

export function billingWebhook(signature: string, payload: string) {
  return handleBillingWebhook(provider, signature, payload, syncStore);
}

export function getSyncedSubscriptionState(subscriptionId: string) { return syncStore.get(subscriptionId); }
