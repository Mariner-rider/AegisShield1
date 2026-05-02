import { describe, expect, it } from "vitest";
import { DetectionPipeline } from "../../services/detector/src";

describe("advanced detector pipeline", () => {
  it("detects signature-based attacks and supports tenant tuning", async () => {
    const pipeline = new DetectionPipeline();
    pipeline.configureTenantRules("t1", { enabledPacks: ["signature", "behavioral-anomaly"], severityMultiplier: 1.1 });

    const out = await pipeline.ingest({
      tenantId: "t1",
      projectId: "p1",
      environment: "prod",
      route: "/login?u=1' OR 1=1 --",
      method: "GET",
      ip: "1.1.1.1",
      timestamp: new Date().toISOString(),
      bodySample: "<script>alert(1)</script>",
      userAgent: "test"
    });

    expect(out.findings.some((f) => f.pack === "signature")).toBe(true);
  });
});
