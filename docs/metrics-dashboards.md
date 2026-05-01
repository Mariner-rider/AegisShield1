# Metrics and Dashboard Examples

## Core metrics
- `aegis_requests_total{route,decision}`
- `aegis_detection_tags_total{tag}`
- `aegis_incident_severity_histogram`
- `aegis_action_executions_total{action,status}`
- `aegis_approval_pending_total{action}`
- `aegis_policy_bundle_version{version,active}`

## Dashboard panels
1. Top blocked routes and actions.
2. Login abuse and challenge rate over time.
3. Token reuse detections by source IP.
4. SSRF/Injection detections with severity heatmap.
5. Emergency mode activation timeline.
6. Approval queue aging and SLA breaches.
