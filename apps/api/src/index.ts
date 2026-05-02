import http from "node:http";
import express, { NextFunction, Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import { parsePlatformEnv } from "../../../packages/config/src";
import { enforceApiRateLimit } from "./middleware/abuse-controls";
import { checkRateLimit, resolveTier } from "./middleware/rate-limit";
import { controller } from "./controllers/platform-controller";
import { onboardingController } from "./onboarding/controller";
import { ssoController } from "./sso/controller";
import { getSiemConfig, getDeadLetters, runScheduledExport, setSiemConfig } from "./siem/service";
import { listIntegrations, triggerTestEvent, upsertIntegration } from "./integrations/soc-service";
import { createRealtimeHub, publishRealtimeEvent, registerSseClient, unregisterSseClient } from "./realtime/hub";

const env = parsePlatformEnv(process.env);
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });

const app = express();
app.set("trust proxy", true);
app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => (req.headers["x-request-id"] as string) || `req_${Math.random().toString(36).slice(2)}`
  })
);

app.use(async (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const tenantId = req.header("x-tenant-id") ?? "public";
  const subscription = req.header("x-subscription-tier") ?? "free";
  const tier = resolveTier(subscription);

  const ipDecision = await enforceApiRateLimit(ip, tenantId, subscription);
  if (!ipDecision.ok) {
    res.setHeader("Retry-After", String(ipDecision.retryAfter));
    return res.status(429).json({ error: { message: "IP rate limit exceeded", code: "RATE_LIMITED_IP", requestId: req.id } });
  }

  const userId = req.header("x-user-id");
  if (userId) {
    const userDecision = await checkRateLimit("user", userId, tier, tenantId);
    if (!userDecision.allowed) {
      res.setHeader("Retry-After", String(userDecision.retryAfterSeconds));
      return res.status(429).json({ error: { message: "User rate limit exceeded", code: "RATE_LIMITED_USER", requestId: req.id } });
    }
  }

  const apiKey = req.header("x-api-key");
  if (apiKey) {
    const apiKeyDecision = await checkRateLimit("api_key", apiKey.slice(0, 10), tier, tenantId);
    if (!apiKeyDecision.allowed) {
      res.setHeader("Retry-After", String(apiKeyDecision.retryAfterSeconds));
      return res.status(429).json({ error: { message: "API key rate limit exceeded", code: "RATE_LIMITED_API_KEY", requestId: req.id } });
    }
  }

  return next();
});


app.get("/stream/notifications", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const id = registerSseClient((chunk) => res.write(chunk));
  res.write(`event: connected\ndata: {"ok":true}\n\n`);
  req.on("close", () => unregisterSseClient(id));
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "aegis-api", mode: env.AEGIS_MODE, timestamp: new Date().toISOString() });
});

const userId = (req: Request) => (req.header("x-user-id") || "demo-user");

app.post("/signup", async (req, res) => res.status(201).json(await controller.signup(req.ip, req.body)));
app.post("/login", async (req, res) => res.status(200).json(await controller.login(req.ip, req.body)));
app.post("/organizations", (req, res) => res.status(201).json(controller.createOrganization(userId(req), req.body)));
app.post("/organizations/:orgId/tenants", (req, res) => res.status(201).json(controller.createTenant(userId(req), req.params.orgId, req.body)));
app.post("/tenants/:tenantId/projects", (req, res) => res.status(201).json(controller.createProject(userId(req), req.params.tenantId, req.body)));
app.post("/tenants/:tenantId/projects/:projectId/environments", (req, res) => res.status(201).json(controller.createEnvironment(userId(req), req.params.tenantId, req.params.projectId, req.body)));
app.post("/tenants/:tenantId/api-keys", (req, res) => res.status(201).json(controller.issueApiKey(userId(req), req.params.tenantId, req.body)));
app.post("/tenants/:tenantId/api-keys/:keyId/rotate", (req, res) => res.status(200).json(controller.rotateApiKey(userId(req), req.params.tenantId, req.params.keyId)));
app.post("/tenants/:tenantId/api-keys/:keyId/revoke", (req, res) => res.status(200).json(controller.revokeApiKey(userId(req), req.params.tenantId, req.params.keyId)));
app.get("/organizations/:orgId/subscription", (req, res) => res.status(200).json(controller.viewSubscriptionStatus(userId(req), req.params.orgId)));
app.post("/organizations/:orgId/trial/start", (req, res) => res.status(201).json(controller.startTrial(userId(req), req.params.orgId)));

app.get("/onboarding/state", (req, res) => res.status(200).json(onboardingController.getState(userId(req))));
app.post("/onboarding/start", (req, res) => res.status(200).json(onboardingController.start(userId(req))));
app.post("/onboarding/organization", (req, res) => res.status(200).json(onboardingController.setOrganization(userId(req), req.body.organizationId)));
app.post("/onboarding/project", (req, res) => res.status(200).json(onboardingController.setProject(userId(req), req.body.projectId)));
app.post("/onboarding/integration", (req, res) => res.status(200).json(onboardingController.chooseIntegration(userId(req), req.body.integrationType)));
app.post("/onboarding/install-instructions", (req, res) => res.status(200).json(onboardingController.generateInstall(userId(req), req.body.integrationType, req.body.apiKey, req.body.agentToken)));
app.post("/onboarding/trial-credentials", (req, res) => res.status(200).json(onboardingController.issueTrialCredentials(userId(req), req.body.tenantId)));
app.post("/onboarding/verify-heartbeat", (req, res) => res.status(200).json(onboardingController.verifyHeartbeat(userId(req))));
app.post("/onboarding/verify-event", (req, res) => res.status(200).json(onboardingController.verifyEvent(userId(req))));
app.post("/onboarding/complete", (req, res) => res.status(200).json(onboardingController.complete(userId(req))));

app.post("/orgs/:orgId/sso/saml", (req, res) => res.status(200).json(ssoController.configureSaml(req.params.orgId, userId(req), req.body)));
app.post("/orgs/:orgId/sso/oidc", (req, res) => res.status(200).json(ssoController.configureOidc(req.params.orgId, userId(req), req.body)));
app.post("/orgs/:orgId/sso/login-result", (req, res) => res.status(200).json(ssoController.loginResult(req.params.orgId, userId(req), !!req.body.ok)));
app.get("/orgs/:orgId/sso/audit", (req, res) => res.status(200).json(ssoController.getAudit(req.params.orgId)));

app.post("/tenants/:tenantId/siem/config", (req, res) => res.status(200).json(setSiemConfig({ ...req.body, tenantId: req.params.tenantId })));
app.get("/tenants/:tenantId/siem/config", (req, res) => res.status(200).json(getSiemConfig(req.params.tenantId) ?? null));
app.post("/tenants/:tenantId/siem/flush", async (req, res) => res.status(200).json(await runScheduledExport(req.params.tenantId)));
app.get("/tenants/:tenantId/siem/dead-letters", (req, res) => res.status(200).json(getDeadLetters(req.params.tenantId)));

app.post("/tenants/:tenantId/integrations", (req, res) => res.status(201).json(upsertIntegration({ ...req.body, tenantId: req.params.tenantId })));
app.get("/tenants/:tenantId/integrations", (req, res) => res.status(200).json(listIntegrations(req.params.tenantId)));
app.post("/tenants/:tenantId/integrations/test-trigger", async (req, res) => { const out = await triggerTestEvent(req.params.tenantId, req.body.type); await publishRealtimeEvent({ type: "integration_test", tenantId: req.params.tenantId, out, severity: "high" }); return res.status(200).json(out); });

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  req.log.error({ err }, "request failed");
  res.status(500).json({ error: { message: err.message || "Internal Server Error", code: "INTERNAL_ERROR", requestId: req.id } });
});

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, { cors: { origin: "*" } });
createRealtimeHub(io);

const server = httpServer.listen(PORT, HOST, () => {
  logger.info({ host: HOST, port: PORT }, "aegis-api started");
});

const shutdown = (signal: string) => {
  logger.info({ signal }, "shutdown signal received");
  server.close(() => {
    logger.info("http server closed");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export { app, server };
