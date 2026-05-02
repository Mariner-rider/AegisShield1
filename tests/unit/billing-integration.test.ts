import { describe, it, expect } from "vitest";
import { createOrConvertSubscription, changeSubscriptionPlan, cancelSubscription, billingWebhook, getSyncedSubscriptionState, listBillingInvoices } from "../../apps/api/src/billing/integration";
import crypto from "node:crypto";

describe("billing provider integration", () => {
  it("creates subscription with coupon and invoices", async () => {
    const sub = await createOrConvertSubscription("cust1", "growth", "monthly", { code: "WELCOME20", percentOff: 20 });
    const invoices = await listBillingInvoices("cust1");
    expect(sub.id).toBeTruthy();
    expect(invoices[0].metadata?.coupon).toBe("WELCOME20");
  });

  it("changes plan and cancels", async () => {
    const sub = await createOrConvertSubscription("cust2", "starter", "monthly");
    const up = await changeSubscriptionPlan(sub.id, "business", "annual");
    expect(up.plan).toBe("business");
    const canceled = await cancelSubscription(sub.id, false);
    expect(canceled.state).toBe("canceled");
  });

  it("handles payment failure webhook and grace", () => {
    const payload = JSON.stringify({ type: "invoice.payment_failed", subscriptionId: "sub-1" });
    const sig = crypto.createHmac("sha256", "whsec_demo").update(payload).digest("hex");
    billingWebhook(sig, payload);
    expect(getSyncedSubscriptionState("sub-1")?.status).toBe("past_due");
  });
});
