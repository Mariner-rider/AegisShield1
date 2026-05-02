# SIEM Export Schema v1.0

Fields:
- schemaVersion: `1.0`
- tenantId: tenant boundary key
- type: detection_event | response_action | audit_log | policy_change
- id: event identifier
- timestamp: ISO-8601 UTC
- severity: optional numeric severity
- payload: structured event object
