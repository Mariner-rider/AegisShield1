# AegisShield Architecture

## Step 1: Interfaces and Trust Boundaries
AegisShield is a policy-driven defensive framework for web apps/APIs. Node.js SDK is first-class, with language-neutral contracts for future Python/Java/Go SDKs.

### Operating modes
- `observe`: detect + log, no blocking.
- `guard`: enforce low/medium confidence controls.
- `contain`: aggressive session/token containment.
- `emergency`: read-only + strict deny for risky routes.

### Monorepo layout
- `packages/sdk`: middleware/hooks + secure defaults.
- `packages/policy-engine`: policy evaluation abstraction (OPA/Rego compatible decision input/output).
- `packages/telemetry-client`: OTel traces, metrics, structured logs.
- `packages/threat-intel-client`: normalized intel and signatures.
- `packages/response-orchestrator`: approval-aware action pipeline.
- `services/*`: control plane, policy service, ingestor, detector, responder, audit.

## Step 2: Request-to-response flow
1. SDK captures request context, auth/session metadata, and headers.
2. Detector evaluates heuristics + pattern checks + anomaly score.
3. Policy engine evaluates rules with mode, risk, intel context.
4. Response orchestrator executes only allowed actions by policy.
5. High-impact actions require approval token from control plane.
6. Audit service stores immutable event and decision trace.

## Step 3: Defensive controls
- Access control checks via route policy map.
- Brute-force defense via distributed rate limit + account/session scoring.
- Injection/XSS/SSRF pattern detection + outbound allowlist.
- CSRF verifier hook with token/cookie binding.
- Deception telemetry: honey routes/tokens/sinks for signal only.

## Step 4: Threat-intel lifecycle
- Scheduled ingestion from CISA KEV/advisory feeds and dependency advisories.
- Normalize to `ThreatIntelRecord` schema.
- Generate recommendations and signed policy bundle metadata.
- Auto-apply low-risk intel only: IOC lists, deny-list metadata, severity mapping.

## Step 5: Deployment
- Sidecar/library mode for app embedding.
- Gateway-adapter interface for API gateway plugins.
- Docker Compose for local stack.
- Helm starter chart for Kubernetes deployment.

## Tradeoffs
- Uses deterministic policy + bounded automation over autonomous remediation to reduce blast radius.
- Modes permit gradual rollout and safer adoption.
- Explicit approval workflow slows urgent high-impact responses but protects availability and accountability.
