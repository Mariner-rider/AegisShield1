# Security Assumptions and Limitations
- AegisShield is defensive and policy bounded; it is not an EDR replacement.
- Detection quality depends on telemetry completeness and policy tuning.
- High-impact actions are approval-gated by design and may increase response latency.
- Threat intel ingestion updates metadata only; no automatic code/runtime logic mutation.
- Deception routes/tokens are telemetry-only and must not collect unnecessary personal data.
