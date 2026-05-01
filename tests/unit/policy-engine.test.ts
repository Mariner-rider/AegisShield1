import { describe, it, expect } from "vitest";
import { EmbeddedPolicyEngine } from "../../packages/policy-engine/src";

describe("EmbeddedPolicyEngine", () => {
  it("blocks critical ssrf patterns", () => {
    const engine = new EmbeddedPolicyEngine();
    const decision = engine.evaluate({
      mode: "guard",
      event: { route: "/x", method: "POST", ip: "1.1.1.1", headers: {}, timestamp: new Date().toISOString() },
      detection: { score: 99, tags: ["ssrf"], reasons: ["match"] }
    });
    expect(decision.allow).toBe(false);
  });
});
