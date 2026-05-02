package aegisshield.mode

default allow = true
allow = false { input.mode == "emergency" ; input.method != "GET" }
actions := ["switch_read_only", "disable_risky_route", "notify_operators"] { not allow }
