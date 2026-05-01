import crypto from "node:crypto";
import { BillingProvider, BillingInterval, Coupon, InvoiceRecord, PlanChangeRequest, ProviderSubscription } from "./types";

export class MockPayProvider implements BillingProvider {
  name = "mockpay";
  private subs = new Map<string, ProviderSubscription>();
  private invoices = new Map<string, InvoiceRecord[]>();
  constructor(private readonly webhookSecret: string) {}

  async createSubscription(customerId: string, plan: string, interval: BillingInterval, coupon?: Coupon): Promise<ProviderSubscription> {
    const id = `${customerId}-${Date.now()}`;
    const sub: ProviderSubscription = { id, customerId, plan, interval, state: "active", currentPeriodEnd: new Date(Date.now() + 30*86400000).toISOString() };
    this.subs.set(id, sub);
    const amount = interval === "annual" ? 99000 : 9900;
    const discounted = coupon?.percentOff ? Math.round(amount * (1 - coupon.percentOff / 100)) : amount;
    this.invoices.set(customerId, [{ id: `inv-${id}`, subscriptionId: id, amountCents: discounted, currency: "USD", status: "paid", receiptUrl: `https://mockpay/receipt/${id}`, metadata: { coupon: coupon?.code ?? "" } }]);
    return sub;
  }
  async changePlan(req: PlanChangeRequest): Promise<ProviderSubscription> { const s=this.subs.get(req.subscriptionId)!; s.plan=req.targetPlan; s.interval=req.interval; return s; }
  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean): Promise<ProviderSubscription> { const s=this.subs.get(subscriptionId)!; s.cancelAtPeriodEnd=atPeriodEnd; if(!atPeriodEnd) s.state="canceled"; return s; }
  async listInvoices(customerId: string): Promise<InvoiceRecord[]> { return this.invoices.get(customerId) ?? []; }
  verifyWebhook(signature: string, payload: string): boolean { const sig=crypto.createHmac("sha256", this.webhookSecret).update(payload).digest("hex"); return sig===signature; }
}
