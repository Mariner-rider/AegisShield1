export * from "./providers/types";
export * from "./providers/mockpay";
export * from "./webhooks/handler";
export * from "./sync/state-sync";

export interface BillingPortalView {
  customerId: string;
  subscriptionId: string;
  invoices: { id: string; amountCents: number; status: string; receiptUrl?: string }[];
}
