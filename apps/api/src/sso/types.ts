export type SsoProtocol = "saml" | "oidc";
export type OrgRole = "owner" | "admin" | "analyst" | "developer" | "read_only";

export interface SamlConfigInput { metadataXml: string; entityId?: string; }
export interface OidcConfigInput { issuer: string; clientId: string; clientSecret: string; }
export interface RoleMapping { attribute: string; map: Record<string, OrgRole>; defaultRole: OrgRole; }

export interface SsoConfig {
  orgId: string;
  protocol: SsoProtocol;
  saml?: { metadataXml: string; entityId?: string };
  oidc?: { issuer: string; clientId: string; encryptedClientSecret: string };
  roleMapping: RoleMapping;
  jitProvisioning: boolean;
  domainAutoLogin?: string[];
  ssoOnly: boolean;
  mfaFallback: boolean;
  allowPasswordRollback: boolean;
  updatedAt: string;
}

export interface SessionSecurity {
  sessionExpiresAt: string;
  rotatedAt: string;
  deviceId: string;
}
