# SDK Node Quickstart

## 1) Install and configure
```bash
npm install
export AEGIS_PLATFORM_URL=https://api.aegis.local
export AEGIS_API_KEY=ak_demo_value
export AEGIS_TENANT_ID=tenant_demo
export AEGIS_ENVIRONMENT=dev
export AEGIS_FAILURE_MODE=fail_open
export AEGIS_ENFORCEMENT_MODE=guard
```

## 2) Express adapter
Use `expressAegisMiddleware(client, config, routeMeta)` for request/response inspection hooks.

## 3) Fastify adapter
Use `fastifyAegisHook(client, config, routeMeta)` and wire `preHandler` + `onResponse`.

## 4) Behavior
- API-key auth config is loaded from env.
- Local buffer stores outbound events until batch flush.
- Policy fetch uses local cache fallback.
- `fail_open` allows traffic on policy fetch failure.
- `fail_closed` blocks with 503 on policy fetch failure.
- `monitor_only` records telemetry but does not block.
