export interface TenantContext {
  tenantId: string;
  organizationId: string;
  projectId?: string;
  environment: "all" | "dev" | "staging" | "prod";
}

export const defaultTenantContext: TenantContext = {
  tenantId: "tenant_demo",
  organizationId: "org_demo",
  environment: "all"
};
