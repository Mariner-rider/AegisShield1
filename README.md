# AegisShield Cloud

AegisShield Cloud is a policy-driven, operator-aware security platform for web apps and APIs.
It is built for defense-in-depth: prevention, detection, controlled response, and auditability.

## Who it is for
- SaaS and API teams needing layered security controls
- Security/platform engineers who need explainable policy and response decisions
- DevOps/SRE teams that require approval-aware automation and operational guardrails

## Architecture at a glance
- **Apps**: API, customer console, admin console, marketing site, example integration app
- **Services**: detector, responder, policy service, billing/licensing, threat intel, audit
- **Packages**: Node SDK, lightweight agent, policy engine, config/shared types
- **Deployment artifacts**: Dockerfiles, compose stack, Helm/k8s starter manifests

## Quickstart
```bash
npm install
npm test
npm run build
docker compose -f infra/docker/docker-compose.full-stack.yml up --build
```

## Security model
- Policy-driven decisioning with signed bundle support
- Immutable audit chaining for detections and responses
- Approval-gated high-impact response actions
- Abuse/rate-limit controls on platform API paths

## Current status
- Core platform structure and major module interfaces are implemented.
- Many components are functional scaffolds for local development and early validation.
- Some runtime integrations are intentionally mocked/stubbed pending production connectors.

See `docs/implementation-status.md` for a precise implemented-vs-planned breakdown.

## Known gaps
- Not all services are wired as fully running HTTP daemons yet.
- Several container startup commands are placeholders for deployment scaffolding.
- In-memory stores are still used in multiple modules and must be replaced for production.
- Full CI reproducibility requires dependency installation and environment setup.

## Docs index
- Getting started: `docs/getting-started.md`
- Platform overview: `docs/platform-overview.md`
- Pricing and plans: `docs/pricing-and-plans.md`
- Trial flow: `docs/trial-flow.md`
- FAQ: `docs/faq.md`
- Honest limitations: `docs/honest-limitations.md`
- Release readiness: `docs/release-readiness-checklist.md`
