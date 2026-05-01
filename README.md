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

## Onboarding (Easy Start)
AegisShield Cloud includes guided onboarding for non-security experts:
1. Sign up
2. Create organization
3. Create first project
4. Choose integration (Node SDK / reverse proxy agent / gateway placeholder)
5. Generate install instructions + copy/paste quickstart
6. Issue trial credentials
7. Verify first heartbeat and first event
8. Mark onboarding complete

Local onboarding artifacts:
- Console wizard state: `apps/console-web/src/onboarding/wizard.ts`
- Troubleshooting page data: `apps/console-web/src/pages/troubleshooting.ts`
- Success page message: `apps/console-web/src/pages/success.ts`
- Backend onboarding API routes: `apps/api/src/onboarding/routes.ts`

## Licensing and Plan Enforcement
- Plan definitions and entitlement model are documented in `docs/licensing-and-billing-model.md`.
- Includes trial lifecycle, grace-period behavior, credential status mapping, and monitor-only fallback behavior.

## Console Dashboard
Customer-facing dashboard lives in `apps/console-web` with:
- required page routing map (`src/routing/routes.ts`)
- overview widgets (`src/components/widgets.ts`)
- multi-tenant context + environment switcher
- search/filter and sensitive-value redaction helpers
See `docs/console-information-architecture.md` for IA and UX details.

## Customer Integration Layer
- Node SDK: `packages/sdk-node` (Express/Fastify adapters, secure config loading, policy cache, event batching, fail-open/fail-closed, monitor-only support).
- Lightweight agent: `packages/agent` (enrollment, environment binding, heartbeat, policy sync, health reporting).
- Example integration app: `apps/example-express`.
- Quickstarts: `docs/sdk-node-quickstart.md`, `docs/agent-quickstart.md`.
