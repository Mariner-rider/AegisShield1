import { describe, it, expect } from "vitest";
import { PlatformService } from "../src/services/platform-service";

describe("platform service", () => {
  it("signup/login and trial", () => {
    const svc = new PlatformService();
    const u = svc.signup({ email: "a@b.com", password: "StrongPass!123", fullName: "A B" });
    const l = svc.login({ email: "a@b.com", password: "StrongPass!123" });
    const org = svc.createOrganization(u.id, "Org", "org");
    const trial = svc.startTrial(org.id);
    expect(l.accessToken).toBeTruthy();
    expect(trial.status).toBe("active");
  });

  it("tenant isolation for environment", () => {
    const svc = new PlatformService();
    const u = svc.signup({ email: "c@d.com", password: "StrongPass!123", fullName: "C D" });
    const org = svc.createOrganization(u.id, "Org2", "org2");
    const t1 = svc.createTenant(org.id, "T1", "t1");
    const t2 = svc.createTenant(org.id, "T2", "t2");
    const p1 = svc.createProject(t1.id, "P1", "p1");
    expect(() => svc.createEnvironment(t2.id, p1.id, "dev", "Dev")).toThrow();
  });
});
