# AegisShield Cloud

AegisShield Cloud is a SaaS-ready, multi-tenant defensive application security platform.

## Platform apps
- `apps/console-web`: customer dashboard shell.
- `apps/admin-web`: internal operations console shell.
- `apps/api`: public/backend API shell.
- `apps/marketing-site`: landing/docs starter shell.

## Core services
- `services/policy-engine`: policy evaluation service.
- `services/detector`: detection/severity service.
- `services/responder`: controlled response execution service.
- `services/threat-intel`: feed ingestion + safe normalization.
- `services/billing`: subscription/billing contract placeholder.
- `services/licensing`: plan/entitlement contract placeholder.
- `services/audit`: immutable audit event chain.

## Shared packages
- `packages/sdk-node`: Node middleware and SDK hooks.
- `packages/agent`: sidecar/gateway integration contract.
- `packages/shared-types`: cross-service/domain types.
- `packages/ui`: shared UI components/contracts.
- `packages/config`: env validation strategy.

## Migration
This repository includes historical framework-first components and now introduces service/app boundaries for multi-tenant operation. See:
- `docs/architecture-overview.md`
- `docs/repo-migration-notes.md`
