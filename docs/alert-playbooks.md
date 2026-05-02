# Alert Playbooks

## Templates implemented
- Brute force detected
- Suspicious token reuse
- SSRF attempt
- Admin endpoint probing

Each alert includes:
- what happened
- why it matters
- recommended next step

## Enrichment
- Basic IP intelligence (reputation/ASN/geo hint)
- Route metadata
- Request metadata (redacted)

## Lifecycle
- New alerts are created from structured raw signals.
- Alerts can be acknowledged by analysts.
- Repeated attacks are grouped by tenant/project/kind/route/source.
- Repeated high-severity groups auto-escalate.

## Redaction safety
- Secrets/tokens/password fragments are redacted.
- Email-like PII patterns are redacted.
- Payload snippets are trimmed to reduce exposure.
