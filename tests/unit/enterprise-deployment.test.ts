import { describe, expect, it } from "vitest";
import {
  buildPartnerDashboard,
  canPartnerAccessTenant,
  getFailoverRegion,
  resolveStorageRegions,
  routeByLatency,
  validateBillingSplit,
  validateEnterpriseConfig
} from "../../services/control-plane/src";

describe("enterprise deployment", () => {
  it("validates strict tenant isolation", () => {
    expect(() =>
      validateEnterpriseConfig({
        tenantId: "t-1",
        mode: "saas",
        residency: { residency: "us", primaryRegion: "us-east-1", allowedRegions: ["us-east-1"] },
        isolation: {
          strictTenantIsolation: true,
          isolateComputePlane: true,
          isolateDataPlane: true,
          separateEncryptionKeysPerTenant: true
        },
        auditCompliance: { immutableAuditLog: true, retentionDays: 365, complianceEvidenceExport: true }
      })
    ).not.toThrow();
  });

  it("routes to lowest latency healthy region and resolves failover", () => {
    expect(
      routeByLatency([
        { region: "us-east-1", latencyMs: 45, healthy: true },
        { region: "us-west-2", latencyMs: 20, healthy: true }
      ])
    ).toBe("us-west-2");

    expect(
      getFailoverRegion("us-east-1", {
        regionRoutingEnabled: true,
        storageRegionMap: { "t-1": ["us-east-1"] },
        latencyAwareIngestion: true,
        failoverPlans: [{ primary: "us-east-1", secondary: "us-west-2", trigger: "healthcheck_failure" }]
      })
    ).toBe("us-west-2");

    expect(
      resolveStorageRegions("t-1", {
        regionRoutingEnabled: true,
        storageRegionMap: { "t-1": ["us-east-1", "us-west-2"] },
        latencyAwareIngestion: true,
        failoverPlans: []
      })
    ).toHaveLength(2);
  });

  it("enforces partner tenant boundaries and billing split", () => {
    const partner = {
      partnerId: "p-1",
      name: "MSP One",
      allowedTenantIds: ["t-1"],
      apiKeyId: "key-1",
      whiteLabel: { brandName: "MSP Shield", customDomain: "shield.msp.example" }
    };

    const dashboard = buildPartnerDashboard(partner, [
      { tenantId: "t-1", tenantName: "Tenant One", parentPartnerId: "p-1" },
      { tenantId: "t-2", tenantName: "Tenant Two", parentPartnerId: "p-1" }
    ]);

    expect(dashboard.tenants).toHaveLength(1);
    expect(canPartnerAccessTenant(partner, "t-1")).toBe(true);
    expect(canPartnerAccessTenant(partner, "t-2")).toBe(false);

    expect(() => validateBillingSplit({ tenantId: "t-1", partnerId: "p-1", platformPercent: 70, partnerPercent: 30 })).not.toThrow();
    expect(() => validateBillingSplit({ tenantId: "t-1", partnerId: "p-1", platformPercent: 80, partnerPercent: 30 })).toThrow();
  });
});
