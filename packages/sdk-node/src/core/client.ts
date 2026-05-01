import { PolicyDecision, SDKConfig, SecurityEvent } from "./types";

export class PlatformClient {
  private policyCache: PolicyDecision = { allow: true, reason: "default" };
  private buffer: SecurityEvent[] = [];

  constructor(private readonly config: SDKConfig) {}

  async fetchPolicy(): Promise<PolicyDecision> {
    // mocked network call
    return this.policyCache;
  }

  setPolicyForDemo(decision: PolicyDecision): void { this.policyCache = decision; }

  queueEvent(event: SecurityEvent): void {
    this.buffer.push(event);
    if (this.buffer.length >= (this.config.batchSize ?? 50)) void this.flushEvents();
  }

  async flushEvents(): Promise<void> {
    if (!this.buffer.length) return;
    // mocked telemetry delivery; keep local buffer on error in real impl
    this.buffer = [];
  }

  bufferedCount(): number { return this.buffer.length; }
}
