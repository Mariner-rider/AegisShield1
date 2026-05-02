import crypto from "node:crypto";
import { ApprovalAction, SignedRequest } from "../types";

export class ApprovalWorkflow {
  private approvals = new Map<string, { action: ApprovalAction; expiresAt: string; approvedBy: string }>();
  constructor(private readonly approvalKey: string) {}

  signActionRequest(req: Omit<SignedRequest, "signature">): SignedRequest {
    const payload = `${req.action}:${req.projectId}:${req.requestedBy}`;
    const signature = crypto.createHmac("sha256", this.approvalKey).update(payload).digest("hex");
    return { ...req, signature };
  }

  verifySignedRequest(req: SignedRequest): boolean {
    const payload = `${req.action}:${req.projectId}:${req.requestedBy}`;
    const expected = crypto.createHmac("sha256", this.approvalKey).update(payload).digest("hex");
    return expected === req.signature;
  }

  approve(key: string, action: ApprovalAction, approvedBy: string, expiresAt: string): void {
    this.approvals.set(key, { action, approvedBy, expiresAt });
  }

  hasValidApproval(key: string, action: ApprovalAction, now = new Date()): boolean {
    const v = this.approvals.get(key);
    return Boolean(v && v.action === action && new Date(v.expiresAt) > now);
  }
}
