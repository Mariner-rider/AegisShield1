# Reseller / Partner Mode

AegisShield partner mode supports managed customer tenant relationships with limited control-plane visibility.

## Core model

- Partner organizations
- Sub-tenants (customer tenants) under partner
- Tenant allow-list per partner

## Access boundaries

- Partner dashboard can view only explicitly allowed customer tenants
- Dashboard permissions are limited to metadata and billing summaries
- No data-plane access is granted by default

Partner access checks are enforced by tenant allow-list (`canPartnerAccessTenant`).

## Billing split model (basic)

Billing split is represented as platform % + partner % and must total 100.

## White-label support

Partner model supports:

- Brand name
- Optional logo URL
- Optional custom domain

## Partner API access

Partner records include API key linkage (`apiKeyId`) to support scoped partner APIs.
