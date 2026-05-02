export interface OnboardingRecord {
  tenantId: string;
  organization: string;
  status: "pending" | "active" | "blocked";
  createdAt: string;
}

export interface BillingRecord {
  tenantId: string;
  plan: string;
  status: "active" | "past_due" | "canceled";
  mrrUsd: number;
}

export interface ThreatRecord {
  tenantId: string;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  detectedAt: string;
  resolved: boolean;
}

export interface ResolutionRecord {
  tenantId: string;
  issueId: string;
  source: "model" | "analyst";
  resolvedAt: string;
}

export interface AdminSecurityDashboard {
  onboardingSummary: { total: number; pending: number; blocked: number };
  billingSummary: { activeTenants: number; pastDueTenants: number; totalMrrUsd: number };
  threatSummary: { open: number; criticalOpen: number; bySeverity: Record<string, number> };
  resolutionSummary: { modelResolutions: number; analystResolutions: number };
}

export function buildAdminSecurityDashboard(
  onboardings: OnboardingRecord[],
  billings: BillingRecord[],
  threats: ThreatRecord[],
  resolutions: ResolutionRecord[]
): AdminSecurityDashboard {
  const bySeverity = threats.reduce<Record<string, number>>((acc, threat) => {
    acc[threat.severity] = (acc[threat.severity] ?? 0) + 1;
    return acc;
  }, {});

  return {
    onboardingSummary: {
      total: onboardings.length,
      pending: onboardings.filter((record) => record.status === "pending").length,
      blocked: onboardings.filter((record) => record.status === "blocked").length
    },
    billingSummary: {
      activeTenants: billings.filter((record) => record.status === "active").length,
      pastDueTenants: billings.filter((record) => record.status === "past_due").length,
      totalMrrUsd: billings.reduce((sum, record) => sum + record.mrrUsd, 0)
    },
    threatSummary: {
      open: threats.filter((record) => !record.resolved).length,
      criticalOpen: threats.filter((record) => !record.resolved && record.severity === "critical").length,
      bySeverity
    },
    resolutionSummary: {
      modelResolutions: resolutions.filter((record) => record.source === "model").length,
      analystResolutions: resolutions.filter((record) => record.source === "analyst").length
    }
  };
}
