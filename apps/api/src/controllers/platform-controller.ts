import { PlatformService } from "../services/platform-service";
import { basicRateLimit } from "../middleware/rate-limit";

const svc = new PlatformService();

export const controller = {
  signup: (ip: string, body: unknown) => { if (!basicRateLimit(`signup:${ip}`, 10)) throw new Error("rate limited"); return svc.signup(body); },
  login: (ip: string, body: unknown) => { if (!basicRateLimit(`login:${ip}`, 20)) throw new Error("rate limited"); return svc.login(body); },
  createOrganization: (userId: string, body: any) => svc.createOrganization(userId, body.name, body.slug),
  createTenant: (_userId: string, orgId: string, body: any) => svc.createTenant(orgId, body.name, body.tenantKey),
  createProject: (_userId: string, tenantId: string, body: any) => svc.createProject(tenantId, body.name, body.slug),
  createEnvironment: (_userId: string, tenantId: string, projectId: string, body: any) => svc.createEnvironment(tenantId, projectId, body.type, body.name),
  issueApiKey: (userId: string, tenantId: string, body: any) => svc.issueApiKey(tenantId, body.label, userId),
  rotateApiKey: (userId: string, tenantId: string, keyId: string) => svc.rotateApiKey(tenantId, keyId, userId),
  revokeApiKey: (_userId: string, tenantId: string, keyId: string) => svc.revokeApiKey(tenantId, keyId),
  viewSubscriptionStatus: (_userId: string, orgId: string) => svc.subscriptionStatus(orgId),
  startTrial: (_userId: string, orgId: string) => svc.startTrial(orgId)
};
