export type AdminRole = "super_admin" | "security_analyst" | "billing_ops" | "read_only";

export interface AdminPermissionContext {
  tenantId: string;
  partnerId?: string;
  allowedTenantIds?: string[];
}

const permissions: Record<AdminRole, string[]> = {
  super_admin: ["onboarding:read", "billing:read", "threats:read", "resolution:read", "code:guard"],
  security_analyst: ["onboarding:read", "threats:read", "resolution:read", "code:guard"],
  billing_ops: ["billing:read", "onboarding:read"],
  read_only: ["onboarding:read", "billing:read", "threats:read", "resolution:read"]
};

export function canAccess(role: AdminRole, permission: string): boolean {
  return permissions[role].includes(permission);
}

export function canAccessTenantData(context: AdminPermissionContext, targetTenantId: string): boolean {
  if (!context.allowedTenantIds || context.allowedTenantIds.length === 0) {
    return context.tenantId === targetTenantId;
  }

  return context.allowedTenantIds.includes(targetTenantId);
}
