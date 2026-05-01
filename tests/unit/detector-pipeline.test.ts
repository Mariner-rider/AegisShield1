import { describe, it, expect } from "vitest";
import { DetectionPipeline } from "../../services/detector/src";

describe("DetectionPipeline", () => {
  it("detects brute force, token reuse, ssrf, and injection heuristics", () => {
    const p = new DetectionPipeline();
    for (let i = 0; i < 6; i++) {
      p.ingest({ tenantId: "t1", projectId: "p1", environment: "prod", route: "/login", method: "POST", status: 401, ip: "1.1.1.1", timestamp: new Date().toISOString() });
    }
    p.ingest({ tenantId: "t1", projectId: "p1", environment: "prod", route: "/profile", method: "GET", ip: "1.1.1.1", tokenId: "tok1", timestamp: new Date().toISOString() });
    const tokenReuse = p.ingest({ tenantId: "t1", projectId: "p1", environment: "prod", route: "/profile", method: "GET", ip: "2.2.2.2", tokenId: "tok1", timestamp: new Date().toISOString() });
    const ssrf = p.ingest({ tenantId: "t1", projectId: "p1", environment: "prod", route: "/fetch", method: "POST", ip: "3.3.3.3", outboundHost: "169.254.169.254", timestamp: new Date().toISOString() });
    const inj = p.ingest({ tenantId: "t1", projectId: "p1", environment: "prod", route: "/search", method: "GET", ip: "4.4.4.4", bodySample: "../etc/passwd union select", timestamp: new Date().toISOString() });

    expect(tokenReuse.findings.some(f => f.ruleId === "suspicious-token-reuse")).toBe(true);
    expect(ssrf.findings.some(f => f.ruleId === "ssrf-outbound-abuse")).toBe(true);
    expect(inj.findings.some(f => f.ruleId === "path-traversal-injection-heuristics")).toBe(true);
  });

  it("supports false-positive suppression", () => {
    const p = new DetectionPipeline();
    p.addSuppression({ tenantId: "t1", ruleId: "admin-route-probing", expiresAt: new Date(Date.now() + 60000).toISOString(), reason: "known scanner test" });
    const out = p.ingest({ tenantId: "t1", projectId: "p1", environment: "prod", route: "/admin/config", method: "GET", ip: "9.9.9.9", timestamp: new Date().toISOString() });
    expect(out.suppressed).toBe(true);
  });
});
