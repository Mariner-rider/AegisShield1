# SOC Integrations

## Supported integrations
- Generic webhook
- Slack incoming webhook
- Microsoft Teams incoming webhook

## Event types
- high severity detection
- automated response triggered
- policy violation
- suspicious admin action
- trial expiry alerts (optional low priority)

## Tenant-level configuration
Each tenant can configure one or more integrations with:
- endpoint
- enabled state
- severity threshold
- selected event types

## Structured payload fields
- event ID
- timestamp
- severity
- project/environment
- summary
- recommended action
- deep link to console

## Delivery behavior
- Retry logic (up to 3 attempts)
- Rate limiting to reduce alert storms
- Dedupe window to suppress duplicates

## Test trigger
Use test trigger API to validate connector delivery without waiting for live incidents.
