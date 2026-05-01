export type DeploymentMode = "saas" | "single_tenant_cloud" | "private_vpc";

export interface ResidencyConfig {
  residency: "us" | "eu" | "apac" | "regional";
  primaryRegion: string;
  allowedRegions: string[];
}

export interface IsolationConfig {
  strictTenantIsolation: true;
  isolateComputePlane: boolean;
  isolateDataPlane: boolean;
  separateEncryptionKeysPerTenant: boolean;
}

export interface AuditComplianceConfig {
  immutableAuditLog: boolean;
  retentionDays: number;
  complianceEvidenceExport: boolean;
}

export interface EnterpriseDeploymentConfig {
  tenantId: string;
  mode: DeploymentMode;
  residency: ResidencyConfig;
  isolation: IsolationConfig;
  auditCompliance: AuditComplianceConfig;
}

export function validateEnterpriseConfig(config: EnterpriseDeploymentConfig): void {
  if (!config.isolation.strictTenantIsolation) {
    throw new Error("strict tenant isolation is required");
  }

  if (!config.residency.allowedRegions.includes(config.residency.primaryRegion)) {
    throw new Error("primary region must be in allowed regions");
  }
}
