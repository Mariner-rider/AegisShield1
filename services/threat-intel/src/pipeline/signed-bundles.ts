import crypto from "node:crypto";
import { NormalizedIntel, SignedBundle } from "../types";

export class BundlePipeline {
  private versions: SignedBundle[] = [];
  constructor(private readonly key: string) {}

  generateLowRiskBundle(items: NormalizedIntel[]): SignedBundle {
    const payload = items.filter(i => i.lowRiskAutoApply);
    const version = `v${this.versions.length + 1}.0.0`;
    const generatedAt = new Date().toISOString();
    const signature = crypto.createHmac("sha256", this.key).update(JSON.stringify({ version, payload, generatedAt })).digest("hex");
    const rollbackTo = this.versions.at(-1)?.version;
    const b = { version, generatedAt, payload, signature, rollbackTo };
    this.versions.push(b);
    return b;
  }

  rollback(version: string): SignedBundle | undefined { return this.versions.find(v => v.version === version); }
}
