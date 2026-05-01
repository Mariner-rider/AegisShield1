import { OnboardingService } from "./service";

const svc = new OnboardingService();
export const onboardingController = {
  getState: (userId: string) => svc.get(userId),
  start: (userId: string) => svc.start(userId),
  setOrganization: (userId: string, organizationId: string) => svc.setOrganization(userId, organizationId),
  setProject: (userId: string, projectId: string) => svc.setProject(userId, projectId),
  chooseIntegration: (userId: string, integrationType: any) => svc.chooseIntegration(userId, integrationType),
  issueTrialCredentials: (userId: string, tenantId: string) => svc.issueTrialCredentials(userId, tenantId),
  generateInstall: (userId: string, integration: any, apiKey: string, agentToken: string) => svc.generateInstall(userId, integration, apiKey, agentToken),
  verifyHeartbeat: (userId: string) => svc.verifyHeartbeat(userId),
  verifyEvent: (userId: string) => svc.verifyEvent(userId),
  complete: (userId: string) => svc.complete(userId)
};
