# Secrets Management Guidance
- Use cloud KMS + secret manager (AWS Secrets Manager/GCP Secret Manager/Vault).
- Inject secrets as environment variables or CSI-mounted files at runtime.
- Rotate webhook secrets, signing keys, and API tokens on schedule.
- Keep separate keys per environment and least-privileged IAM access.
