import { Server as SocketIOServer } from "socket.io";
import Redis from "ioredis";
import { randomUUID } from "node:crypto";

const pub = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");
const sub = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

const sseClients = new Map<string, { write: (chunk: string) => void }>();

export function registerSseClient(write: (chunk: string) => void): string {
  const id = randomUUID();
  sseClients.set(id, { write });
  return id;
}

export function unregisterSseClient(id: string): void {
  sseClients.delete(id);
}

export function createRealtimeHub(io: SocketIOServer): void {
  io.on("connection", (socket) => {
    socket.join("attack-feed");
  });

  sub.subscribe("aegis.events", (err) => {
    if (err) io.emit("error", { message: "failed to subscribe realtime channel" });
  });

  sub.on("message", (_channel, payload) => {
    io.to("attack-feed").emit("attack_event", JSON.parse(payload));
    for (const client of sseClients.values()) {
      client.write(`event: notification\ndata: ${payload}\n\n`);
    }
  });
}

export async function publishRealtimeEvent(event: Record<string, unknown>): Promise<void> {
  await pub.publish("aegis.events", JSON.stringify(event));
}
