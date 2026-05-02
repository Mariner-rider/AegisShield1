import { describe, it, expect } from "vitest";
import { loadConfig, PlatformClient } from "../../packages/sdk-node/src";
import { LightweightAgent } from "../../packages/agent/src";

describe("customer integration layer", () => {
  it("loads secure sdk config and buffers events", async () => {
    const cfg = loadConfig({
      AEGIS_PLATFORM_URL: "https://api.aegis.local",
      AEGIS_API_KEY: "demo_api_key_123456",
      AEGIS_TENANT_ID: "t1",
      AEGIS_ENVIRONMENT: "dev",
      AEGIS_FAILURE_MODE: "fail_open",
      AEGIS_ENFORCEMENT_MODE: "monitor_only"
    });
    const c = new PlatformClient(cfg);
    c.queueEvent({ path: "/x", method: "GET", timestamp: new Date().toISOString() });
    expect(c.bufferedCount()).toBe(1);
    await c.flushEvents();
    expect(c.bufferedCount()).toBe(0);
  });

  it("enrolls and heartbeats agent", async () => {
    const agent = new LightweightAgent({ platformUrl: "https://api", enrollmentToken: "enroll_123", environmentId: "env1", heartbeatIntervalSec: 30 });
    await agent.enroll();
    const hb = await agent.heartbeat();
    expect(hb.enrolled).toBe(true);
    expect(hb.lastHeartbeatAt).toBeTruthy();
  });
});
