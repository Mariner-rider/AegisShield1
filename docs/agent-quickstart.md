# Agent Quickstart

## Enrollment and binding
1. Provide enrollment token and environment ID.
2. Call `agent.enroll()` to bind environment.

## Heartbeat
Call `agent.heartbeat()` on interval (e.g. every 30s) to report liveness.

## Policy sync
Call `agent.syncPolicy()` to refresh local policy version marker.

## Health reporting
Call `agent.reportHealth()` for local control-plane status.

## Responsibilities
- Enrollment token exchange
- Environment binding
- Heartbeat
- Policy sync
- Health reporting
- Minimal local control-plane duties only
