import { describe, it, expect } from "vitest";
import { OnboardingService } from "../src/onboarding/service";

describe("onboarding service", () => {
  it("progresses and completes", () => {
    const svc = new OnboardingService();
    svc.start("u1");
    svc.setOrganization("u1", "org1");
    svc.setProject("u1", "proj1");
    svc.chooseIntegration("u1", "node_sdk");
    svc.generateInstall("u1", "node_sdk", "api_abc", "agt_xyz");
    svc.verifyHeartbeat("u1");
    svc.verifyEvent("u1");
    const done = svc.complete("u1");
    expect(done.completedAt).toBeTruthy();
    expect(done.quickstartCommand).toContain("npm i @aegis/sdk-node");
  });
});
