# Sample Incident Flow: Suspicious Session Quarantine
1. Request hits `/admin/panel` with missing MFA header and high failed-auth history.
2. Detector tags `suspicious_admin` and raises anomaly score above threshold.
3. Policy in `contain` mode returns: quarantine session, revoke token, notify operators, immutable incident record.
4. Responder executes bounded actions and writes decision trace to audit service.
5. Operators review event, approve/deny any high-impact follow-up actions.
