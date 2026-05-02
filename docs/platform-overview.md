# Platform Overview

AegisShield Cloud combines SDK/agent telemetry, policy evaluation, threat detection, and controlled response.

## Core layers
1. **Integration layer**: SDK + agent for event and heartbeat telemetry.
2. **Detection layer**: rule packs and anomaly scoring.
3. **Policy layer**: signed bundles and versioned decisions.
4. **Response layer**: cooldowns, blast-radius controls, approval-gated actions.
5. **Audit layer**: immutable records for traceability.
6. **Billing/licensing layer**: subscription state and entitlement-aware behavior.

## Deployment modes
- Local full-stack via Docker Compose
- Kubernetes via manifests/Helm starter

## Positioning
Defense-in-depth platform with operator oversight, not a silver bullet.
