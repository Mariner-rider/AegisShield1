import { PlatformService } from "../services/platform-service";

const svc = new PlatformService();

export const controller = {
  signup: async (_ip: string, body: unknown) => svc.signup(body),
  login: async (_ip: string, body: unknown) => svc.login(body),
  createOrganization: async (userId: string, body: any) => svc.createOrganization(userId, body.name, body.slug),
  createTenant: async (_userId: string, orgId: string, body: any) => svc.createTenant(orgId, body.name, body.tenantKey),
  createProject: async (_userId: string, tenantId: string, body: any) => svc.createProject(tenantId, body.name, body.slug),
  createEnvironment: async (_userId: string, tenantId: string, projectId: string, body: any) => svc.createEnvironment(tenantId, projectId, body.type, body.name),
  issueApiKey: async (userId: string, tenantId: string, body: any) => svc.issueApiKey(tenantId, body.label, userId),
  rotateApiKey: async (userId: string, tenantId: string, keyId: string) => svc.rotateApiKey(tenantId, keyId, userId),
  revokeApiKey: async (_userId: string, tenantId: string, keyId: string) => svc.revokeApiKey(tenantId, keyId),
  viewSubscriptionStatus: async (_userId: string, orgId: string) => svc.subscriptionStatus(orgId),
  startTrial: async (_userId: string, orgId: string) => svc.startTrial(orgId)
};
