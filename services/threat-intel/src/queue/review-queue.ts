import { NormalizedIntel, ReviewItem } from "../types";

export class ReviewQueue {
  private q: ReviewItem[] = [];
  enqueue(intel: NormalizedIntel, recommendation: string): ReviewItem {
    const item: ReviewItem = { id: `${intel.id}-review`, intelId: intel.id, recommendation, impact: intel.severity === "critical" ? "high" : intel.severity === "high" ? "medium" : "low", status: "pending", createdAt: new Date().toISOString() };
    this.q.push(item); return item;
  }
  listPending(): ReviewItem[] { return this.q.filter(i => i.status === "pending"); }
  setStatus(id: string, status: "approved" | "rejected"): void { const it = this.q.find(i => i.id === id); if (it) it.status = status; }
}
