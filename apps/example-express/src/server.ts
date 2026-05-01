import express from "express";
import helmet from "helmet";
import { loadConfig, PlatformClient, expressAegisMiddleware } from "../../../packages/sdk-node/src";

const app = express();
const config = loadConfig({
  AEGIS_PLATFORM_URL: process.env.AEGIS_PLATFORM_URL ?? "https://api.aegis.local",
  AEGIS_API_KEY: process.env.AEGIS_API_KEY ?? "demo_api_key_123456",
  AEGIS_TENANT_ID: process.env.AEGIS_TENANT_ID ?? "tenant_demo",
  AEGIS_ENVIRONMENT: process.env.AEGIS_ENVIRONMENT ?? "dev",
  AEGIS_FAILURE_MODE: process.env.AEGIS_FAILURE_MODE ?? "fail_open",
  AEGIS_ENFORCEMENT_MODE: process.env.AEGIS_ENFORCEMENT_MODE ?? "guard"
});
const client = new PlatformClient(config);

app.use(express.json({ limit: "100kb" }));
app.use(helmet({ contentSecurityPolicy: { useDefaults: true } }));
app.use(expressAegisMiddleware(client, config, { service: "example-express", routeName: "global" }));

app.get("/health", (_req, res) => res.json({ ok: true, bufferedEvents: client.bufferedCount() }));
app.post("/login", (_req, res) => res.json({ success: true }));
app.get("/admin/panel", (_req, res) => res.json({ admin: true }));

app.listen(3000, () => console.log("AegisShield SDK demo listening on :3000"));
