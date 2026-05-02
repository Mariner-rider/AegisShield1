# AegisShield Cloud

AegisShield Cloud is a policy-driven cybersecurity platform for protecting web apps, APIs, and cloud workloads with defense-in-depth controls (prevention, detection, response, and auditability).

---

## 1) Project Description

AegisShield provides:
- policy-driven security enforcement,
- attack and anomaly detection,
- response orchestration with approvals,
- audit/evidence trails,
- SIEM and SOC integration,
- enterprise deployment and partner models.

The repository currently contains a **production-inspired scaffold + functional modules** suitable for local testing, iterative hardening, and phased productionization.

---

## 2) High-level Mind Map (Repository Map)

```text
AegisShield Cloud
├─ apps/
│  ├─ api/                # control-plane API routes, onboarding, SSO, billing hooks
│  ├─ console-web/        # customer security dashboard models + UI contracts
│  ├─ admin-web/          # internal admin/security ops dashboard models
│  ├─ marketing-site/     # public-facing site scaffolds
│  └─ example-express/    # integration example app
│
├─ services/
│  ├─ detector/           # detection pipeline + alert lifecycle/templates
│  ├─ responder/          # response orchestration + approvals + immutable audit links
│  ├─ policy-service/     # policy service scaffolding
│  ├─ billing/            # provider abstraction + webhook/state sync (MockPay)
│  ├─ licensing/          # licensing and entitlement contracts
│  ├─ reporting/          # compliance/reporting aggregates + export schedulers
│  ├─ siem-export/        # SIEM pipeline and export adapters
│  ├─ integrations/       # Slack/Teams/Webhook integration delivery
│  ├─ threat-intel/       # threat intel ingest/normalize/signed bundles
│  ├─ audit/              # audit service scaffolding
│  └─ control-plane/      # enterprise deployment + partner/reseller + multiregion models
│
├─ packages/
│  ├─ sdk-node/           # Node SDK adapters and core client
│  ├─ agent/              # lightweight agent runtime contracts
│  ├─ policy-engine/      # policy schema and evaluation helpers
│  ├─ response-orchestrator/
│  ├─ config/
│  ├─ shared-types/
│  ├─ telemetry-client/
│  └─ ui/
│
├─ tests/
│  ├─ unit/               # unit test suites for services/modules
│  └─ integration/        # integration-style tests (middleware and flows)
│
├─ infra/                 # docker-compose, helm, k8s starter manifests
├─ deploy/                # deployment templates
├─ docs/                  # architecture, runbooks, guides, limitations
└─ policies/              # example policy packs
```

---

## 3) What is aligned where (Detailed Directory Guide)

### Apps
- `apps/api`: API entrypoint, auth/security, onboarding, billing hooks, SSO, SIEM routes.
- `apps/console-web`: customer-facing console contracts (theme/layout/dashboard/widgets/pages).
- `apps/admin-web`: internal operations/security dashboard, RBAC/tenant access models.
- `apps/example-express`: sample downstream integration target.

### Services
- `services/detector`: detection and alert modeling.
- `services/responder`: response workflows and approval gating.
- `services/reporting`: compliance mapping/report exports.
- `services/control-plane`: enterprise modes, region strategy, partner/reseller boundaries.

### Packages
- SDK/agent/policy/shared contracts used by apps/services.

### Infra
- `infra/docker/docker-compose.full-stack.yml`: full local stack template.
- `infra/helm/`, `infra/k8s/`: VPS/Kubernetes migration starting points.

---

## 4) Step-by-step: Run on a Normal PC (8GB RAM, i3 class)

## 4.1 Prerequisites
Install:
- Node.js 22+
- npm 10+
- Docker + Docker Compose plugin
- Git

Recommended PC settings:
- Keep browser tabs minimal during full-stack runs.
- Use SSD disk if available.

## 4.2 Clone and bootstrap
```bash
git clone <your-repo-url>
cd AegisShield1
npm install
```

## 4.3 Validate baseline
```bash
npm run build
npm test
```

> If `vitest` is missing locally, run `npm install` again and ensure `node_modules/.bin` exists.

## 4.4 Start minimal stack (best for 8GB)
Start only what you need first:
```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

Then scale gradually.

## 4.5 Start full stack (higher resource usage)
```bash
docker compose -f infra/docker/docker-compose.full-stack.yml up --build
```

## 4.6 Verify health
- API health route scaffolds live under `apps/api/src/ops/health.ts`.
- Check logs:
```bash
docker compose -f infra/docker/docker-compose.full-stack.yml logs -f
```

## 4.7 Stop stack
```bash
docker compose -f infra/docker/docker-compose.full-stack.yml down
```

---

## 5) Step-by-step: Deploy on VPS

## 5.1 VPS baseline
Recommended minimum:
- 2 vCPU
- 4–8 GB RAM
- 40+ GB SSD
- Ubuntu 22.04 LTS

## 5.2 Server setup
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ca-certificates
```
Install Docker and Compose plugin (official Docker docs preferred).

## 5.3 Pull code and configure
```bash
git clone <your-repo-url>
cd AegisShield1
cp .env.example .env   # if you create one for runtime secrets
```

## 5.4 Build and run
```bash
docker compose -f infra/docker/docker-compose.yml up -d --build
```

## 5.5 Reverse proxy + TLS (recommended)
- Put Nginx/Caddy in front.
- Enable HTTPS with Let's Encrypt.
- Restrict admin endpoints by IP/VPN.

## 5.6 Operations checklist
- Configure backups for DB and critical configs.
- Enable log rotation.
- Configure monitoring/alerting.
- Keep images updated and rebuild regularly.

---

## 6) Step-by-step: How to Modify Project per Your Needs

## 6.1 Add a new API feature
1. Add service logic in `apps/api/src/services/*`.
2. Add route/controller in `apps/api/src/routes/*` or feature folder routes.
3. Add unit/integration tests in `apps/api/tests` or `tests/unit`.
4. Export/wire in API entrypoint.

## 6.2 Add a new detection rule
1. Update detector rule packs in `services/detector/src/packs/rules.ts`.
2. Add fixture in `services/detector/src/fixtures/events.ts`.
3. Add/extend tests in `tests/unit/detector-pipeline.test.ts`.

## 6.3 Add a new response action
1. Extend types in `services/responder/src/types.ts`.
2. Wire policy/approval checks in `services/responder/src/approval/*`.
3. Add audit linkage in responder audit helpers.

## 6.4 Add new console UI section
1. Update `apps/console-web/src/pages/sections.ts`.
2. Add nav metadata in `apps/console-web/src/components/layout.ts`.
3. Add required tests in `apps/console-web/src/components/ui.test.ts`.

## 6.5 Add new integration connector
1. Create connector in `services/integrations/src/connectors/*`.
2. Register it in delivery engine.
3. Add tests under `tests/unit/soc-integrations.test.ts`.

---

## 7) User Workflow (End-customer)

1. User signs up / is onboarded.
2. User connects app/API via SDK or integration.
3. Telemetry/events flow into detection services.
4. Detections trigger policies.
5. Safe responses auto-execute; sensitive responses require approval.
6. User reviews dashboard (threats, posture, responses, audit trail).
7. User exports reports and integrations (SIEM/SOC).

---

## 8) Admin Workflow (Internal Security/Ops)

1. Review tenant onboarding status.
2. Review billing/subscription health.
3. Monitor global threat posture and unresolved critical alerts.
4. Approve/deny high-impact response actions.
5. Review audit records and compliance evidence outputs.
6. Manage enterprise deployment modes, regions, and partner access boundaries.

---

## 9) Security and Hardening Notes

- Secret hashing + timing-safe verification in API auth helpers.
- Input sanitization helpers and minimum secret policy checks.
- Rate-limit and abuse-control memory pruning safeguards.
- Non-root container runtime defaults.
- Tenant isolation controls in enterprise/partner models.

> Important: no system can guarantee absolute invulnerability. Operate with defense-in-depth, least privilege, observability, and rapid incident response.

---

## 10) Local Developer Command Reference

```bash
npm install
npm run build
npm test
npm run lint

# minimal compose
npm run dev:compose

# full stack compose
docker compose -f infra/docker/docker-compose.full-stack.yml up --build
```

---

## 11) Recommended Next Steps

- Replace all remaining in-memory stores with persistent backends.
- Convert placeholder container startup commands to real service entrypoints.
- Add CI/CD pipeline with lint + test + image scan gates.
- Add centralized secret management and production observability dashboards.

---

## 12) Additional Documentation Index

- `docs/getting-started.md`
- `docs/platform-overview.md`
- `docs/architecture-overview.md`
- `docs/admin-security-platform.md`
- `docs/performance-optimization.md`
- `docs/enterprise-deployment.md`
- `docs/reseller-mode.md`
- `docs/compliance-reporting.md`
- `docs/ui-modernization.md`
