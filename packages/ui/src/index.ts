export type AlertLevel = "info" | "warning" | "critical";
export interface SecurityBannerProps { level: AlertLevel; message: string; }
