# SIEM Integration

## Supported export methods
- HTTP push (webhook stream)
- JSON file batch export
- Kafka (optional abstraction)
- Syslog format (basic support)

## Exportable data
- detection events
- response actions
- audit logs
- policy changes

## Pipeline
1. Normalize events to schema `1.0`.
2. Apply per-tenant filtering (type + severity).
3. Enqueue for stream or scheduled batch flush.
4. Deliver via configured adapter.

## Delivery behavior
- Near real-time streaming via enqueue + periodic flush.
- Scheduled batch export via explicit flush job.
- Retry attempts for adapter failures.
- Dead-letter queue for persistent failures.
- Backpressure handling via queue caps.

## Tenant isolation
- Export config is tenant-scoped.
- Events are dropped if tenant IDs do not match config.
- Dead-letter access is tenant filtered.

## Schema versioning
- Current schema: `1.0`
- Reference: `services/siem-export/src/schemas/schema-v1.md`
