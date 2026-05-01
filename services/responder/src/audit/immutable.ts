import crypto from "node:crypto";

export interface ResponseAuditRecord { id: string; prevHash: string; hash: string; action: string; context: Record<string, unknown>; createdAt: string; }

export class ResponseAuditLog {
  private chain: ResponseAuditRecord[] = [];
  append(action: string, context: Record<string, unknown>): ResponseAuditRecord {
    const prevHash = this.chain.at(-1)?.hash ?? "GENESIS";
    const createdAt = new Date().toISOString();
    const hash = crypto.createHash("sha256").update(JSON.stringify({ prevHash, action, context, createdAt })).digest("hex");
    const rec = { id: crypto.randomUUID(), prevHash, hash, action, context, createdAt };
    this.chain.push(rec);
    return rec;
  }
  entries(): readonly ResponseAuditRecord[] { return this.chain; }
}
