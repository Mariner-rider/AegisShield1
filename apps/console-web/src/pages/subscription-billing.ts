export interface PlanOption { code: string; label: string; monthly: number; annual: number; }
export const planOptions: PlanOption[] = [
  { code: "starter", label: "Starter", monthly: 49, annual: 490 },
  { code: "growth", label: "Growth", monthly: 149, annual: 1490 },
  { code: "business", label: "Business", monthly: 499, annual: 4990 },
  { code: "enterprise", label: "Enterprise", monthly: 0, annual: 0 }
];

export const billingPageModel = {
  actions: ["upgrade", "downgrade", "cancel"],
  fields: ["coupon_code", "billing_interval", "grace_status", "invoice_history", "receipt_links"]
};
