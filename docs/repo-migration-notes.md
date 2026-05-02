# Repository Migration Notes (Framework-first -> Platform-oriented)

## What moved
- SDK logic conceptually moved from `packages/sdk` to `packages/sdk-node` (new package boundary for Node-first SDK).
- Policy/audit/detector/responder/threat-intel capabilities now represented under `services/*` platform service names.
- Deployment artifacts moved from `deploy/*` to `infra/*` for platform-aligned ops boundaries.

## Why
- Multi-tenant SaaS requires explicit app/service/package segmentation.
- Clear interfaces and bounded contexts improve maintainability and auditability.
- Platform naming reduces confusion between embeddable framework code and managed cloud services.

## Compatibility approach
- Existing working logic retained and wrapped/re-exported where possible.
- New boundaries introduced incrementally to reduce risk.
