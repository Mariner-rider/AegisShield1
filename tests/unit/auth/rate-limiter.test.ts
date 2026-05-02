import { describe, expect, it } from "vitest";
import { checkRateLimit, resolveTier } from "../../../apps/api/src/middleware/rate-limit";

describe("redis sliding window limiter", () => {
  it("resolves subscription tiers", () => {
    expect(resolveTier("enterprise")).toBe("enterprise");
    expect(resolveTier("pro")).toBe("pro");
    expect(resolveTier("unknown")).toBe("free");
  });

  it("returns limiter decision shape", async () => {
    const out = await checkRateLimit("ip", "127.0.0.1", "free", "t1");
    expect(typeof out.allowed).toBe("boolean");
    expect(typeof out.retryAfterSeconds).toBe("number");
  });
});
