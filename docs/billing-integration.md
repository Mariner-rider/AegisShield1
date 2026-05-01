# Billing Integration

## Provider abstraction
AegisShield Cloud uses a swappable `BillingProvider` interface supporting:
- subscriptions
- monthly/annual billing
- invoices + receipt metadata
- plan changes and cancellation
- webhook verification/handling
- failed payment handling

## First provider
`MockPayProvider` is the first integration implementing the provider contract.
It is production-structured (interface-first) and replaceable with Stripe/Adyen/etc.

## Webhook sync
Webhook handler maps events to subscription-state sync:
- `invoice.payment_succeeded` -> `active`
- `invoice.payment_failed` -> `past_due` + grace period
- `customer.subscription.deleted` -> `canceled`

## Trial conversion + coupons
`createOrConvertSubscription` accepts optional coupon/promo metadata for conversion flows.

## Enforcement updates
Subscription state sync feeds licensing/enforcement decisions for:
- continued blocking eligibility
- monitor-only fallback
- grace-period dashboard access

## UI surfaces
- Console billing page model supports upgrade/downgrade/cancel, coupon entry, invoice history and receipts.
- Admin billing visibility exposes org-level state, grace, and payment failure indicators.
