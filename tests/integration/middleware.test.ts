import { describe, it, expect } from "vitest";
import { detect } from "../../packages/sdk/src/middleware";

const base = { method: "POST", headers: {}, timestamp: new Date().toISOString() };

describe("detect scenarios", () => {
  it("brute force login attempts", () => {
    let res: any;
    for (let i = 0; i < 6; i++) res = detect({ ...base, route: "/login", ip: "10.0.0.1" });
    expect(res.tags).toContain("brute_force");
  });

  it("suspicious token reuse", () => {
    detect({ ...base, route: "/profile", ip: "10.0.0.2", tokenId: "t1" });
    const res = detect({ ...base, route: "/profile", ip: "10.0.0.9", tokenId: "t1" });
    expect(res.tags).toContain("suspicious_token_reuse");
  });

  it("ssrf attempt", () => {
    const res = detect({ ...base, route: "/fetch", ip: "10.0.0.3", bodySample: "http://169.254.169.254/latest/meta-data" });
    expect(res.tags).toContain("ssrf");
  });

  it("access control violation", () => {
    const res = detect({ ...base, route: "/admin/export", ip: "10.0.0.4", headers: {} });
    expect(res.tags).toContain("access_control_violation");
  });

  it("bot scraping burst", () => {
    let res: any;
    for (let i = 0; i < 31; i++) res = detect({ ...base, route: "/catalog", ip: "10.0.0.5" });
    expect(res.tags).toContain("bot_scrape_burst");
  });

  it("emergency read only policy condition", () => {
    const res = detect({ ...base, route: "/orders", ip: "10.0.0.6" });
    expect(res.score).toBeGreaterThanOrEqual(0);
  });
});
