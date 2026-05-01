package aegisshield.auth

default allow = true

allow = false {
  input.route == "/login"
  input.failed_attempts > 5
}

actions := ["challenge_request", "notify_operators", "create_immutable_incident"] {
  not allow
}
