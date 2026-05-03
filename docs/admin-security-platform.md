# Admin Security Platform

This internal admin platform is focused on protecting AegisShield itself while operating customer workloads.

## Dashboard capabilities

- Onboarding visibility (pending/active/blocked tenants)
- Billing visibility (active/past-due/MRR)
- Threat monitoring (open + critical open counts)
- Resolution tracking (model vs analyst)

## Access controls

- Role-based permissions (`super_admin`, `security_analyst`, `billing_ops`, `read_only`)
- Tenant-scoped data access checks
- Default deny beyond assigned tenant scope

## Secure API posture

- Secret hashing and timing-safe verification
- Input sanitization helper to reduce injection risk
- Minimum secret policy checks for privileged credentials

## Container hardening baseline

- Non-root runtime user
- Production `NODE_ENV`
- Reduced package install scope (`--omit=dev`)

## Important limitation

No platform can guarantee that "no AI and no human can ever bypass" defenses. Security is risk reduction through defense-in-depth, least privilege, observability, and rapid response.
