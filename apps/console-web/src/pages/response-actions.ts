export interface ResponseActionApproval {
  id: string;
  actionType: "block-ip" | "rotate-key" | "isolate-service";
  requestedBy: string;
  requestedAt: string;
  reason: string;
  target: string;
  status: "pending" | "approved" | "denied";
}

export const responseActionsPage = {
  id: "response-actions",
  title: "Response Actions",
  route: "/response-actions",
  queueMode: "approval",
  oneClickActions: ["approve", "deny"],
  columns: ["requestedAt", "actionType", "target", "requestedBy", "reason", "status"],
  queue: [] as ResponseActionApproval[]
};
