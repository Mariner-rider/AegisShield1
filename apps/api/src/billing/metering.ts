import { UsageMeter } from "../../../../services/billing/src";

export class UsageMeterStore {
  private meters = new Map<string, UsageMeter>();
  get(tenantId: string): UsageMeter { return this.meters.get(tenantId) ?? { requestsInspected: 0, eventsProcessed: 0, protectedApps: 0, seatsUsed: 0 }; }
  incRequests(tenantId: string, n = 1): UsageMeter { return this.save(tenantId, { requestsInspected: this.get(tenantId).requestsInspected + n }); }
  incEvents(tenantId: string, n = 1): UsageMeter { return this.save(tenantId, { eventsProcessed: this.get(tenantId).eventsProcessed + n }); }
  setProtectedApps(tenantId: string, n: number): UsageMeter { return this.save(tenantId, { protectedApps: n }); }
  setSeats(tenantId: string, n: number): UsageMeter { return this.save(tenantId, { seatsUsed: n }); }
  private save(tenantId: string, patch: Partial<UsageMeter>): UsageMeter {
    const next = { ...this.get(tenantId), ...patch };
    this.meters.set(tenantId, next);
    return next;
  }
}
