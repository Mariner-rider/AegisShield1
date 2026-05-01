export const siemExportsPage = {
  methods: ["http_push", "json_batch", "kafka", "syslog"],
  dataTypes: ["detection_event", "response_action", "audit_log", "policy_change"],
  controls: ["severity_filter", "batch_size", "schedule", "stream_toggle"],
  actions: ["save_config", "flush_now", "view_dead_letters"]
};
