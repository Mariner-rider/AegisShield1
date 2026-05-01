export interface Entitlement { tenantId: string; feature: string; enabled: boolean; }
export function hasEntitlement(entitlements: Entitlement[], feature: string): boolean {
  return entitlements.some(e => e.feature === feature && e.enabled);
}
