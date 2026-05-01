export interface ApprovalRecord {
  id: string;
  action: string;
  requestedBy: string;
  approver: string;
  reason: string;
  approvedAt: string;
  expiresAt: string;
}

export class ApprovalStore {
  private records: ApprovalRecord[] = [];

  add(record: ApprovalRecord): void { this.records.push(record); }

  valid(action: string, now = new Date()): boolean {
    return this.records.some(r => r.action === action && new Date(r.expiresAt) > now);
  }
}
