# Detection Pipeline

## Pipeline stages
1. **Event ingestion**: SDK/agent request telemetry enters `DetectionPipeline.ingest`.
2. **Normalization**: events conform to `IngestedRequestEvent` with tenant/project/environment attribution.
3. **Rule evaluation**: detection packs evaluate request context and behavior counters.
4. **Scoring**: each finding includes confidence + severity.
5. **Suppression**: false-positive suppression rules are applied per tenant/rule/expiry.
6. **Output assembly**: `DetectionEvent` includes findings, decision traces, recommendations, and optional response candidates.
7. **Audit forwarding**: downstream components persist alerts and decisions in immutable audit records.

## Detection packs implemented
- brute force / credential stuffing
- suspicious token reuse
- admin route probing
- SSRF-like outbound abuse indicators
- anomalous request burst behavior
- path traversal / obvious injection heuristics
- BOLA/BOPLA risk hints from API access patterns

## Output model
Each finding contains:
- `ruleId`, `ruleVersion`
- `confidence`, `severity`
- `recommendation`
- optional `responseCandidate`
- `decisionTrace`

## Safety notes
- Heuristic rules are intentionally explainable and bounded.
- Response recommendations are advisory candidates; execution remains policy/orchestrator controlled.
