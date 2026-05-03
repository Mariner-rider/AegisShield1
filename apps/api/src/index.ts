import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import rateLimit from "@fastify/rate-limit";
import Redis from "ioredis";
import { parsePlatformEnv } from "../../../packages/config/src";
import { controller } from "./controllers/platform-controller";
import { onboardingController } from "./onboarding/controller";
import { ssoController } from "./sso/controller";

const env = parsePlatformEnv(process.env);
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : undefined;

export function buildServer() {
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? "info" }, trustProxy: true });

  app.register(cors, { origin: true });
  app.register(helmet);

  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-change-me",
    sign: { expiresIn: "30m" }
  });

  app.register(rateLimit, {
    global: true,
    max: 300,
    timeWindow: "1 minute",
    redis,
    keyGenerator: (request) => request.headers["x-api-key"] as string || request.ip
  });

  app.register(swagger, {
    openapi: {
      info: { title: "Aegis API", version: "1.0.0" },
      servers: [{ url: `http://${HOST}:${PORT}` }]
    }
  });
  app.register(swaggerUi, { routePrefix: "/docs" });

  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ error: { code: "UNAUTHORIZED", message: "Missing or invalid JWT" } });
    }
  };

  app.get("/health", async () => ({ ok: true, service: "aegis-api", mode: env.AEGIS_MODE, timestamp: new Date().toISOString() }));

  app.post("/auth/signup", async (request) => controller.signup(request.ip, request.body as Record<string, unknown>));
  app.post("/auth/login", async (request, reply) => {
    const result = await controller.login(request.ip, request.body as Record<string, unknown>);
    const token = app.jwt.sign({ sub: (result as { userId?: string }).userId ?? "demo-user", scope: ["tenant:read", "tenant:write"] });
    reply.send({ ...result, token });
  });

  app.register(async (secureRoutes) => {
    secureRoutes.addHook("onRequest", authenticate);

    secureRoutes.get("/onboarding/state", async (request) => onboardingController.getState((request.user as { sub: string }).sub));
    secureRoutes.post("/onboarding/start", async (request) => onboardingController.start((request.user as { sub: string }).sub));

    secureRoutes.post("/orgs/:orgId/sso/saml", async (request) => {
      const { orgId } = request.params as { orgId: string };
      return ssoController.configureSaml(orgId, (request.user as { sub: string }).sub, request.body as Record<string, unknown>);
    });
  });

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    reply.code(error.statusCode ?? 500).send({ error: { code: error.code ?? "INTERNAL_ERROR", message: error.message } });
  });

  return app;
}

export async function startServer() {
  const app = buildServer();
  const shutdown = async (signal: string) => {
    app.log.info({ signal }, "shutdown signal received");
    await app.close();
    if (redis) await redis.quit();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  await app.listen({ port: PORT, host: HOST });
  return app;
}

if (process.env.NODE_ENV !== "test") {
  void startServer();
}
