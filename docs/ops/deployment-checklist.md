# Deployment Checklist
- Build and push all app/service images.
- Apply Kubernetes manifests/Helm chart values.
- Configure secrets from external manager.
- Validate `/health/live` and `/health/ready` for services.
- Confirm OTel traces, metrics, and logs are flowing.
- Verify API abuse controls/rate limits.
- Validate billing webhooks and subscription sync.
- Confirm audit retention and data retention policy by plan.
