import { io, Socket } from "socket.io-client";

export interface LiveAlertEvent {
  type: string;
  tenantId?: string;
  severity?: "low" | "medium" | "high" | "critical";
  [k: string]: unknown;
}

export class RealtimeClient {
  private socket?: Socket;
  private reconnectDelayMs = 1000;

  connect(baseUrl: string, onEvent: (event: LiveAlertEvent) => void): void {
    this.socket = io(baseUrl, { transports: ["websocket"], reconnection: true, reconnectionDelay: this.reconnectDelayMs });
    this.socket.on("attack_event", onEvent);
    this.socket.on("connect_error", () => {
      this.reconnectDelayMs = Math.min(30_000, this.reconnectDelayMs * 2);
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}
