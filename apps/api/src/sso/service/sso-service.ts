import crypto from "node:crypto";
import { SsoConfig, SamlConfigInput, OidcConfigInput, RoleMapping, OrgRole, SessionSecurity } from "../types";
import { validateSamlMetadata } from "../adapters/saml";
import { validateOidcConfig } from "../adapters/oidc";

const store = new Map<string, SsoConfig>();
const devices = new Map<string, string>();

function encrypt(secret: string, key: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", crypto.createHash("sha256").update(key).digest(), iv);
  const enc = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

export class SsoService {
  constructor(private readonly encryptionKey: string) {}

  configureSaml(orgId: string, saml: SamlConfigInput, roleMapping: RoleMapping, opts: { jitProvisioning: boolean; domainAutoLogin?: string[]; ssoOnly: boolean; mfaFallback: boolean; allowPasswordRollback: boolean; }): SsoConfig {
    if (!validateSamlMetadata(saml)) throw new Error("invalid saml metadata");
    const cfg: SsoConfig = { orgId, protocol: "saml", saml, roleMapping, jitProvisioning: opts.jitProvisioning, domainAutoLogin: opts.domainAutoLogin, ssoOnly: opts.ssoOnly, mfaFallback: opts.mfaFallback, allowPasswordRollback: opts.allowPasswordRollback, updatedAt: new Date().toISOString() };
    store.set(orgId, cfg); return cfg;
  }

  configureOidc(orgId: string, oidc: OidcConfigInput, roleMapping: RoleMapping, opts: { jitProvisioning: boolean; domainAutoLogin?: string[]; ssoOnly: boolean; mfaFallback: boolean; allowPasswordRollback: boolean; }): SsoConfig {
    if (!validateOidcConfig(oidc)) throw new Error("invalid oidc config");
    const cfg: SsoConfig = { orgId, protocol: "oidc", oidc: { issuer: oidc.issuer, clientId: oidc.clientId, encryptedClientSecret: encrypt(oidc.clientSecret, this.encryptionKey) }, roleMapping, jitProvisioning: opts.jitProvisioning, domainAutoLogin: opts.domainAutoLogin, ssoOnly: opts.ssoOnly, mfaFallback: opts.mfaFallback, allowPasswordRollback: opts.allowPasswordRollback, updatedAt: new Date().toISOString() };
    store.set(orgId, cfg); return cfg;
  }

  mapRole(cfg: SsoConfig, idpValue?: string): OrgRole { return (idpValue && cfg.roleMapping.map[idpValue]) || cfg.roleMapping.defaultRole; }
  get(orgId: string): SsoConfig | undefined { return store.get(orgId); }

  enforceLoginMethod(orgId: string, method: "password" | "sso"): boolean {
    const cfg = store.get(orgId); if (!cfg) return true;
    if (cfg.ssoOnly && method === "password") return cfg.allowPasswordRollback;
    return true;
  }

  createSession(userId: string, deviceFingerprint: string, ttlMin = 60): SessionSecurity {
    const deviceId = crypto.createHash("sha256").update(deviceFingerprint).digest("hex").slice(0, 16);
    devices.set(userId, deviceId);
    const now = Date.now();
    return { sessionExpiresAt: new Date(now + ttlMin * 60_000).toISOString(), rotatedAt: new Date(now).toISOString(), deviceId };
  }
}
