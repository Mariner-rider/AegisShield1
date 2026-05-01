# Response Orchestration

## Scope
Defensive response orchestration for AegisShield Cloud. No arbitrary shell execution is implemented.

## Automated actions
- block request
- rate-limit actor
- quarantine session
- revoke token
- disable risky route (feature-flag integration point)
- switch monitor-only or read-only modes
- notify operators
- create incident record

## Approval-required actions
- global logout
- project-wide lockdown
- maintenance mode
- service restart hook
- credential rotation workflow

## Workflow
1. Detector output enters response policy engine.
2. Policy engine selects candidate actions + cooldown key.
3. Cooldown prevents repeated execution storms.
4. Blast-radius controls restrict scope (`actor`, `project`, `tenant`).
5. Approval workflow gates high-impact actions.
6. Every action and rollback is appended to immutable response audit chain.

## Restart hook safety
- Restart integration is modeled as a controlled action (`service_restart_hook`).
- Requires explicit approval and signed request verification.
- No direct shell/SSH command execution path exists in this service.

## Rollback
- Response service supports rollback markers (`rollback_<action>`).
- Rollback entries are audit-logged immutably.
