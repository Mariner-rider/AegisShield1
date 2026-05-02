import { describe, it, expect } from "vitest";
import { SsoService } from "../../apps/api/src/sso/service/sso-service";
import { recordSsoAudit, listSsoAudit } from "../../apps/api/src/sso/service/audit";

describe("sso service", () => {
  it("configures saml and maps role", () => {
    const svc = new SsoService("encryption-key");
    const cfg = svc.configureSaml("org1", { metadataXml: "<EntityDescriptor></EntityDescriptor>" }, { attribute: "role", map: { Admin: "admin" as any }, defaultRole: "read_only" }, { jitProvisioning: true, ssoOnly: true, mfaFallback: true, allowPasswordRollback: true });
    expect(cfg.protocol).toBe("saml");
    expect(svc.mapRole(cfg, "Admin")).toBe("admin");
  });

  it("configures oidc with encrypted secret and enforces sso only", () => {
    const svc = new SsoService("encryption-key");
    const cfg = svc.configureOidc("org2", { issuer: "https://issuer.example", clientId: "cid", clientSecret: "verysecret123" }, { attribute: "groups", map: {}, defaultRole: "developer" }, { jitProvisioning: true, ssoOnly: true, mfaFallback: true, allowPasswordRollback: false });
    expect(cfg.oidc?.encryptedClientSecret).toContain(":");
    expect(svc.enforceLoginMethod("org2", "password")).toBe(false);
  });

  it("tracks session security and audit events", () => {
    const svc = new SsoService("encryption-key");
    const session = svc.createSession("u1", "device-fp");
    expect(session.deviceId).toBeTruthy();
    recordSsoAudit({ orgId: "org1", actor: "u1", event: "login_success" });
    expect(listSsoAudit("org1").length).toBeGreaterThan(0);
  });
});
