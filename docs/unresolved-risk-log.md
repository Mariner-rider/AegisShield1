# Unresolved Risk Log
1. **Heuristic false positives**: Pattern matching may challenge legitimate traffic under bursty workloads.
2. **Distributed rate-limit drift**: In-memory counters in SDK are process-local; production should use shared store.
3. **Token reuse signal quality**: NAT/proxy environments can create ambiguity.
4. **Policy signing key custody**: Requires HSM/KMS integration for strongest guarantees.
5. **Threat-intel staleness**: Feed latency may delay IOC updates.
