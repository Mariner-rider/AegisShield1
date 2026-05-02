export const commonErrors = [
  { code: "401_API_KEY", fix: "Confirm your API key is copied exactly and not revoked." },
  { code: "NO_HEARTBEAT", fix: "Check outbound HTTPS egress and ensure agent/SDK can reach AegisShield Cloud." },
  { code: "NO_EVENT", fix: "Send a test request through the protected route and refresh verification." },
  { code: "CLOCK_SKEW", fix: "Sync server time (NTP) and retry token-based setup." }
];
