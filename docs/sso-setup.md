# SSO Setup (SAML 2.0 + OIDC)

## Supported federation protocols
- SAML 2.0
- OpenID Connect (OIDC)

## Organization admin setup
### SAML
1. Upload IdP metadata XML.
2. Configure role mapping attribute and role map.
3. Enable/disable JIT provisioning.
4. Optionally configure domain-based auto-login.
5. Optionally enforce SSO-only login.

### OIDC
1. Configure issuer URL, client ID, and client secret.
2. Client secret is encrypted at rest by SSO service.
3. Configure role mapping and default role.
4. Configure JIT and optional domain auto-login.
5. Optionally enforce SSO-only login.

## Role mapping
Supported mapped roles:
- owner
- admin
- analyst
- developer
- read_only

## MFA fallback and rollback
- MFA fallback can remain enabled for resilience.
- Password login can be disabled via SSO-only mode.
- Emergency rollback to password login is supported when `allowPasswordRollback` is true.

## Session security
- Session expiration support
- Token/session rotation timestamp
- Basic device tracking via hashed fingerprint-derived device ID

## Audit coverage
SSO audit records include:
- login success/failure
- SSO config changes

## Security notes
- Do not store IdP secrets in plaintext.
- Use a strong `SSO_ENCRYPTION_KEY` from a secret manager.
