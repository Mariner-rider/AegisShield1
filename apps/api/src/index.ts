import { parsePlatformEnv } from "../../../packages/config/src";
import { routes } from "./routes/platform-routes";
import { onboardingRoutes } from "./onboarding/routes";
import { ssoRoutes } from "./sso/routes";
import { socIntegrationRoutes } from "./integrations/routes";

const env = parsePlatformEnv(process.env);
export const apiBoot = { name: "aegis-api", mode: env.AEGIS_MODE, routes: [...routes, ...onboardingRoutes, ...ssoRoutes, ...socIntegrationRoutes] };
