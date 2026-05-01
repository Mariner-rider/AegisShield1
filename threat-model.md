# Threat Model (STRIDE-oriented)

## Assets
- Session tokens, JWT claims, credentials, admin operations, customer data, policy bundles, audit records.

## Entry points
- HTTP API ingress, auth endpoints, admin endpoints, outbound HTTP clients, control-plane APIs.

## Key threats and mitigations
- **Spoofing**: signed JWT verification hooks, mTLS between services, key rotation runbook.
- **Tampering**: signed/versioned policy bundles, append-only audit hash chain.
- **Repudiation**: immutable audit log with operator identity and approval records.
- **Information disclosure**: secret exposure detector, strict logs redaction, CSP/security headers.
- **Denial of service**: adaptive rate limiting, bot challenge action, emergency mode.
- **Elevation of privilege**: admin route policy + anomaly scoring + mandatory containment actions.

## Assumptions
- Upstream identity provider provides valid signatures and key discovery.
- Clock synchronization exists for token validation and replay windows.
- External feeds may be stale/unavailable and must degrade gracefully.

## Residual risk
- False positives can impact user experience in guard/contain modes.
- Pattern-based detection is bypassable without layered controls.

## Safety constraints
- No arbitrary shell execution from runtime events.
- No auto code modification from intelligence feeds.
- No intrusive global actions without human approval.
