# Licensing and Billing Model

## Plan definitions
- **starter**: low cost, limited seats/apps, no blocking continuation after trial.
- **growth**: moderate limits, blocking allowed after trial when within entitlement.
- **business**: higher limits and full blocking support.
- **enterprise**: negotiated limits and full blocking support.

## Trial lifecycle
- Trial starts at onboarding and lasts **30 days**.
- Grace period extends dashboard visibility for **7 additional days**.
- On conversion, trial state is marked converted.

## Credential statuses
- `active`
- `trial_active`
- `trial_expired`
- `suspended`
- `revoked`

## Expiration behavior
When trial expires:
- default runtime enforcement to **monitor-only** (`observe` mode),
- disable active blocking if plan does not permit continuation,
- preserve dashboard access during grace period.

## Usage metering
Tracked counters per tenant:
- requests inspected
- events processed
- protected apps
- seats used

## Billing abstraction
Current implementation uses an internal `BillingProvider` interface and `MockBillingProvider`.
No payment processor integration is included yet.
