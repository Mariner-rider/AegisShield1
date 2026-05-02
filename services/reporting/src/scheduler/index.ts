export type ReportSchedule = "weekly" | "monthly";

export interface ScheduledReportConfig {
  tenantId: string;
  schedule: ReportSchedule;
  reportTypes: string[];
}

export class ReportScheduler {
  private schedules: ScheduledReportConfig[] = [];

  public upsert(config: ScheduledReportConfig): void {
    this.schedules = this.schedules.filter(
      (schedule) => !(schedule.tenantId === config.tenantId && schedule.schedule === config.schedule)
    );
    this.schedules.push(config);
  }

  public listByTenant(tenantId: string): ScheduledReportConfig[] {
    return this.schedules.filter((schedule) => schedule.tenantId === tenantId);
  }
}
