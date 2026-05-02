# Console Information Architecture

## Primary navigation
1. Overview Dashboard
2. Projects List
3. Project Detail
4. Environments
5. Installation Status
6. Attacks / Events Feed
7. Detection Detail
8. Response Actions History
9. Policy Bundles
10. API Keys and Tokens
11. Team Members
12. Subscription and Billing
13. Settings
14. Audit Trail

## UX requirements implemented
- Multi-tenant context model (`tenantId`, `organizationId`, optional `projectId`, selected environment).
- Environment switcher (`all`, `dev`, `staging`, `prod`).
- Search/filter utilities for feed-like datasets.
- Loading and empty state text on dashboard/section models.
- Redaction helper to avoid exposing full sensitive values in UI.
- Responsive layout hints (sidebar collapse + mobile breakpoint).

## Data integration approach
- `mock-backend.ts` provides initial mocked data access for events and filters.
- Routing table maps all required pages and detail routes.
