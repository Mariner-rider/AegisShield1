import { describe, expect, it } from "vitest";
import { basicRateLimit } from "../../apps/api/src/middleware/rate-limit";
import { enforceApiRateLimit } from "../../apps/api/src/middleware/abuse-controls";

describe("runtime optimization safeguards", () => {
  it("supports bounded map behavior in rate limiter", () => {
    expect(basicRateLimit("k1", 2, 1, 1)).toBe(true);
    expect(basicRateLimit("k1", 2, 1, 1)).toBe(true);
  });

  it("supports bounded map behavior in abuse limiter", () => {
    expect(enforceApiRateLimit("1.1.1.1", 2, 1, 1)).toBe(true);
    expect(enforceApiRateLimit("1.1.1.1", 2, 1, 1)).toBe(true);
  });
});
