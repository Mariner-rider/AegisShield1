export const ssoConfigPage = {
  sections: ["protocol", "saml_metadata_upload", "oidc_settings", "role_mapping", "jit_provisioning", "domain_auto_login", "sso_only_toggle", "mfa_fallback", "password_rollback"],
  supportedProtocols: ["saml", "oidc"],
  roleOptions: ["owner", "admin", "analyst", "developer", "read_only"]
};
