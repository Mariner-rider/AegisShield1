import { SsoService } from "./service/sso-service";
import { recordSsoAudit, listSsoAudit } from "./service/audit";

const svc = new SsoService(process.env.SSO_ENCRYPTION_KEY ?? "dev_sso_encryption_key_change_me");

export const ssoController = {
  configureSaml: (orgId: string, actor: string, payload: any) => {
    const cfg = svc.configureSaml(orgId, payload.saml, payload.roleMapping, payload.options);
    recordSsoAudit({ orgId, actor, event: "sso_config_changed", metadata: { protocol: "saml" } });
    return cfg;
  },
  configureOidc: (orgId: string, actor: string, payload: any) => {
    const cfg = svc.configureOidc(orgId, payload.oidc, payload.roleMapping, payload.options);
    recordSsoAudit({ orgId, actor, event: "sso_config_changed", metadata: { protocol: "oidc" } });
    return cfg;
  },
  loginResult: (orgId: string, actor: string, ok: boolean) => {
    recordSsoAudit({ orgId, actor, event: ok ? "login_success" : "login_failure" });
    return { ok };
  },
  getAudit: (orgId: string) => listSsoAudit(orgId)
};
