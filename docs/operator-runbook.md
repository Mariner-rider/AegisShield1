# Operator Runbook

## Mode operations
1. Observe: baseline metrics and false-positive review.
2. Guard: enable block/challenge for validated detections.
3. Contain: auto quarantine/revoke for severe confidence.
4. Emergency: force read-only, disable risky features.

## Approval workflow (high-impact)
- Requests: force logout all, cluster restart, global credential rotation, maintenance mode.
- Required: two-person approval with reason and expiry window.

## Incident sample: suspicious session quarantine
1. Detector flags admin endpoint spike + failed token checks.
2. Policy returns `quarantine_session`, `revoke_token`, `notify_operators`.
3. Responder executes actions, writes immutable incident record.
4. Operator reviews decision trace and expands containment if needed.

## Recovery
- Validate threat cleared.
- Gradually step down mode contain -> guard -> observe.
- Conduct post-incident review and policy tuning.
