export interface RegionTarget {
  region: string;
  latencyMs: number;
  healthy: boolean;
}

export interface FailoverPlan {
  primary: string;
  secondary: string;
  trigger: "healthcheck_failure" | "latency_threshold";
}

export interface MultiRegionConfig {
  regionRoutingEnabled: boolean;
  storageRegionMap: Record<string, string[]>;
  latencyAwareIngestion: boolean;
  failoverPlans: FailoverPlan[];
}

export function routeByLatency(targets: RegionTarget[]): string {
  const healthy = targets.filter((target) => target.healthy);
  if (healthy.length === 0) {
    throw new Error("no healthy regions available");
  }

  return healthy.sort((a, b) => a.latencyMs - b.latencyMs)[0].region;
}

export function resolveStorageRegions(tenantId: string, config: MultiRegionConfig): string[] {
  return config.storageRegionMap[tenantId] ?? [];
}

export function getFailoverRegion(primary: string, config: MultiRegionConfig): string | undefined {
  return config.failoverPlans.find((plan) => plan.primary === primary)?.secondary;
}
