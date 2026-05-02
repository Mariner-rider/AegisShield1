export interface PartnerOrganization {
  partnerId: string;
  name: string;
  allowedTenantIds: string[];
  apiKeyId: string;
  whiteLabel: {
    brandName: string;
    customDomain?: string;
    logoUrl?: string;
  };
}

export interface CustomerTenant {
  tenantId: string;
  tenantName: string;
  parentPartnerId?: string;
}

export interface BillingSplit {
  tenantId: string;
  partnerId: string;
  platformPercent: number;
  partnerPercent: number;
}

export interface PartnerDashboardView {
  partnerId: string;
  tenants: CustomerTenant[];
  permissions: Array<"view_tenant_metadata" | "view_billing_summary" | "no_data_plane_access">;
}

export function buildPartnerDashboard(partner: PartnerOrganization, tenants: CustomerTenant[]): PartnerDashboardView {
  const visibleTenants = tenants.filter((tenant) => partner.allowedTenantIds.includes(tenant.tenantId));
  return {
    partnerId: partner.partnerId,
    tenants: visibleTenants,
    permissions: ["view_tenant_metadata", "view_billing_summary", "no_data_plane_access"]
  };
}

export function canPartnerAccessTenant(partner: PartnerOrganization, tenantId: string): boolean {
  return partner.allowedTenantIds.includes(tenantId);
}

export function validateBillingSplit(split: BillingSplit): void {
  if (split.platformPercent + split.partnerPercent !== 100) {
    throw new Error("billing split must equal 100%");
  }
}
