# Compliance Reporting

AegisShield includes a compliance and reporting layer for enterprise tenants focused on internal visibility and readiness.

> **Important**: Reports are **supporting evidence / internal reporting** and do **not** represent certification.

## Supported Framework Mappings (initial)

- OWASP Top 10:2025
- ISO 27001 (basic control mapping)
- NIST CSF (high-level mapping)

## Report Types

- Security posture summary
- Detected threats summary
- Policy coverage report
- Audit trail report
- Compliance mapping report

## Engine Capabilities

- Data aggregation for threats, policies, and audit events
- Scoring model: threat readiness, policy coverage, audit hygiene, overall score
- Executive summary section
- Technical appendix section
- Tenant branding (tenant name and optional logo URL)

## Exports

- JSON export (`toJson`)
- PDF-compatible payload export (`toPdf`, text-based renderer placeholder)

## Scheduled Reports

- Weekly schedule
- Monthly schedule
- Tenant-specific schedule persistence in `ReportScheduler`
