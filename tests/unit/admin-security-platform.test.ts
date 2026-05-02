import { describe, expect, it } from "vitest";
import { buildAdminSecurityDashboard, canAccess, canAccessTenantData } from "../../apps/admin-web/src";
import { enforceMinimumSecretPolicy, sanitizeUserInput } from "../../apps/api/src/auth/security";

describe("admin security platform", () => {
  it("builds admin dashboard summaries", () => {
    const dashboard = buildAdminSecurityDashboard(
      [{ tenantId: "t1", organization: "A", status: "pending", createdAt: "2026-05-01" }],
      [{ tenantId: "t1", plan: "pro", status: "active", mrrUsd: 400 }],
      [{ tenantId: "t1", severity: "critical", category: "auth", detectedAt: "2026-05-01", resolved: false }],
      [{ tenantId: "t1", issueId: "i1", source: "model", resolvedAt: "2026-05-01" }]
    );

    expect(dashboard.onboardingSummary.pending).toBe(1);
    expect(dashboard.billingSummary.totalMrrUsd).toBe(400);
    expect(dashboard.threatSummary.criticalOpen).toBe(1);
    expect(dashboard.resolutionSummary.modelResolutions).toBe(1);
  });

  it("enforces RBAC and tenant scoped access", () => {
    expect(canAccess("security_analyst", "code:guard")).toBe(true);
    expect(canAccess("billing_ops", "code:guard")).toBe(false);
    expect(canAccessTenantData({ tenantId: "t1" }, "t1")).toBe(true);
    expect(canAccessTenantData({ tenantId: "t1", allowedTenantIds: ["t2"] }, "t1")).toBe(false);
  });

  it("applies input sanitization and secret policy", () => {
    expect(sanitizeUserInput("<script>alert('x')</script>")).toBe("scriptalert(x)/script");
    expect(enforceMinimumSecretPolicy("Sh0rt!")).toBe(false);
    expect(enforceMinimumSecretPolicy("VeryStrongP@ssword99")).toBe(true);
  });
});
