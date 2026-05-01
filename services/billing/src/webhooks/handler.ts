import { BillingProvider, SubscriptionState } from "../providers/types";

export interface BillingStateSync { setSubscriptionState(subscriptionId: string, state: SubscriptionState): void; markGrace(subscriptionId: string, until: string): void; }

export function handleBillingWebhook(provider: BillingProvider, signature: string, payload: string, sync: BillingStateSync): string {
  if (!provider.verifyWebhook(signature, payload)) throw new Error("invalid signature");
  const evt = JSON.parse(payload);
  if (evt.type === "invoice.payment_failed") {
    sync.setSubscriptionState(evt.subscriptionId, "past_due");
    sync.markGrace(evt.subscriptionId, new Date(Date.now() + 7*86400000).toISOString());
  }
  if (evt.type === "invoice.payment_succeeded") sync.setSubscriptionState(evt.subscriptionId, "active");
  if (evt.type === "customer.subscription.deleted") sync.setSubscriptionState(evt.subscriptionId, "canceled");
  return "ok";
}
