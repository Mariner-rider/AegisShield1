import crypto from "node:crypto";
import { PolicyBundle, PolicyBundleSchema } from "../../../packages/policy-engine/src/schema";

export interface SignedPolicyBundle {
  bundle: PolicyBundle;
  signature: string;
}

export class PolicyRegistry {
  private versions = new Map<string, SignedPolicyBundle>();
  private active?: string;

  constructor(private readonly signingKey: string) {}

  signAndStore(rawBundle: unknown): SignedPolicyBundle {
    const bundle = PolicyBundleSchema.parse(rawBundle);
    const signature = crypto.createHmac("sha256", this.signingKey).update(JSON.stringify(bundle)).digest("hex");
    const signed = { bundle, signature };
    this.versions.set(bundle.version, signed);
    this.active = bundle.version;
    return signed;
  }

  verify(signed: SignedPolicyBundle): boolean {
    const computed = crypto.createHmac("sha256", this.signingKey).update(JSON.stringify(signed.bundle)).digest("hex");
    return computed === signed.signature;
  }

  rollback(version: string): SignedPolicyBundle {
    const prior = this.versions.get(version);
    if (!prior) throw new Error(`Unknown version ${version}`);
    this.active = version;
    return prior;
  }

  current(): SignedPolicyBundle | undefined {
    return this.active ? this.versions.get(this.active) : undefined;
  }
}
