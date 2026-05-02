# Enterprise Deployment

AegisShield supports enterprise deployment flexibility with strong tenant isolation guarantees.

## Deployment modes

- SaaS (default)
- Single-tenant cloud deployment
- Private VPC deployment

## Residency + region configuration

Enterprise deployment configuration includes:

- Data residency profile (`us`, `eu`, `apac`, or `regional`)
- Primary region
- Allowed regions list

## Isolation requirements

Strict data isolation is enforced:

- `strictTenantIsolation` must always be true
- Compute-plane isolation toggle
- Data-plane isolation toggle
- Separate encryption keys per tenant

If strict isolation is disabled, config validation fails.

## Audit + compliance controls

Configuration supports:

- Immutable audit log enablement
- Retention period settings
- Compliance evidence export

> Compliance outputs are supporting evidence for internal use and not a certification claim.
