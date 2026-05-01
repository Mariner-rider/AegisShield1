export const socIntegrationsPage = {
  integrationTypes: ["webhook", "slack", "teams"],
  eventTypes: ["high_severity_detection", "automated_response_triggered", "policy_violation", "suspicious_admin_action", "trial_expiry_alert"],
  filterControls: ["severity_threshold", "event_type_selection"],
  actions: ["save_integration", "send_test_trigger", "disable_integration"]
};
