package aegisshield.admin

default allow = true
allow = false { startswith(input.route, "/admin") ; input.mfa_verified == false }
actions := ["quarantine_session", "revoke_token", "notify_operators"] { not allow }
