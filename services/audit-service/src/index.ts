import crypto from "node:crypto";

export interface AuditRecord {
  id: string;
  previousHash: string;
  eventHash: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export class ImmutableAuditLog {
  private chain: AuditRecord[] = [];

  append(payload: Record<string, unknown>): AuditRecord {
    const previousHash = this.chain.at(-1)?.eventHash ?? "GENESIS";
    const createdAt = new Date().toISOString();
    const raw = JSON.stringify({ previousHash, payload, createdAt });
    const eventHash = crypto.createHash("sha256").update(raw).digest("hex");
    const record: AuditRecord = { id: crypto.randomUUID(), previousHash, eventHash, payload, createdAt };
    this.chain.push(record);
    return record;
  }

  entries(): readonly AuditRecord[] { return this.chain; }
}
