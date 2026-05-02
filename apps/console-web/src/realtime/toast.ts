import { LiveAlertEvent } from "./client";

export interface ToastNotification { title: string; message: string; variant: "info" | "warning" | "critical"; }

export function toToast(event: LiveAlertEvent): ToastNotification | null {
  if (event.severity !== "critical" && event.severity !== "high") return null;
  return {
    title: "Critical Security Alert",
    message: `Realtime event ${event.type} for tenant ${event.tenantId ?? "unknown"}`,
    variant: event.severity === "critical" ? "critical" : "warning"
  };
}
