# AegisShield Cloud Architecture Overview

```text
[console-web]      [admin-web]      [marketing-site]
      \                |                 /
                 [apps/api]
                     |
        +------------+-------------+
        |                          |
 [services/policy-engine]   [services/detector]
        |                          |
        +-------------+------------+
                      |
             [services/responder]
                      |
         [services/audit] [services/threat-intel]
                      |
           [services/billing] [services/licensing]

Shared packages consumed across apps/services:
- shared-types, config, sdk-node, agent, ui
```

## Multi-tenant boundaries
- Tenant context is carried in all API requests.
- Policy bundles are tenant/version scoped.
- Audit records include tenant identity and immutable event hash chain.

## Service contracts
- `PolicyDecisionRequest -> PolicyDecisionResponse`
- `DetectionSignal -> DecisionTrace`
- `ResponsePlan -> ActionExecutionResult`
- `TenantEntitlement -> EnforcementContext`
