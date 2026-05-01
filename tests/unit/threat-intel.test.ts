import { describe, it, expect } from "vitest";
import { dedupe, normalize } from "../../services/threat-intel/src/pipeline/normalize";
import { BundlePipeline } from "../../services/threat-intel/src/pipeline/signed-bundles";
import { runThreatIntelIngestion } from "../../services/threat-intel/src/jobs/scheduler";

describe("threat intel workflows", () => {
  it("normalizes and deduplicates", () => {
    const a = normalize({ source: "manual_ioc", externalId: "x", payload: { value: "1.2.3.4" }, observedAt: new Date().toISOString() });
    const b = normalize({ source: "manual_ioc", externalId: "x", payload: { value: "1.2.3.4" }, observedAt: new Date().toISOString() });
    expect(dedupe([a, b]).length).toBe(1);
  });

  it("generates signed low-risk bundle with rollback", () => {
    const p = new BundlePipeline("k");
    const i = normalize({ source: "manual_ioc", externalId: "x1", payload: { value: "5.6.7.8" }, observedAt: new Date().toISOString() });
    const b1 = p.generateLowRiskBundle([i]);
    const b2 = p.generateLowRiskBundle([i]);
    expect(b1.signature).toBeTruthy();
    expect(b2.rollbackTo).toBe("v1.0.0");
  });

  it("creates review queue items for higher-impact intel", async () => {
    const out = await runThreatIntelIngestion(["10.0.0.1"], "bundle-key");
    expect(out.lowRiskBundle.version).toBe("v1.0.0");
    expect(Array.isArray(out.pendingReviews)).toBe(true);
  });
});
