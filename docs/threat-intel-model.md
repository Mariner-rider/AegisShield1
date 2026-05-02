# Threat Intelligence Model

## Sources supported
- CISA KEV
- CISA advisories metadata
- Dependency advisory feed abstraction
- Manually uploaded IOC lists

## Ingestion workflow
1. Scheduled ingestion job fetches all configured sources.
2. Raw items pass through normalization to a common schema.
3. Deduplication collapses duplicates by deterministic intel ID.
4. Scoring and confidence metadata are assigned.
5. Intel is mapped to:
   - IOC feeds
   - deny-list suggestions
   - policy recommendations
   - vulnerability watchlists
6. Low-risk items are included in signed bundle generation.
7. Higher-impact recommendations are queued for operator review.

## Safety constraints
- No source-code modification is performed.
- No intrusive runtime actions are auto-created.
- Generated bundles are versioned and signed.
- Rollback is supported via bundle history lookup.

## Review queue
- Pending queue tracks recommendations requiring operator decision.
- Items can be approved or rejected before downstream action.
