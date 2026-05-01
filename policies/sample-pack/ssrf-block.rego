package aegisshield.network

default allow = true
allow = false { input.outbound_host == "169.254.169.254" }
actions := ["block_request", "create_immutable_incident"] { not allow }
