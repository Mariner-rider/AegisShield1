import { OnboardingState, IntegrationType } from "./types";
import { installTemplate } from "../templates/install-templates";
import { PlatformService } from "../services/platform-service";

const states = new Map<string, OnboardingState>();
const platform = new PlatformService();

export class OnboardingService {
  get(userId: string): OnboardingState { return states.get(userId) ?? { userId }; }
  start(userId: string): OnboardingState { const s = { userId }; states.set(userId, s); return s; }
  setOrganization(userId: string, organizationId: string): OnboardingState { return this.save(userId, { organizationId }); }
  setProject(userId: string, projectId: string): OnboardingState { return this.save(userId, { projectId }); }
  chooseIntegration(userId: string, integrationType: IntegrationType): OnboardingState { return this.save(userId, { integrationType }); }

  issueTrialCredentials(userId: string, tenantId: string): OnboardingState {
    const k = platform.issueApiKey(tenantId, "trial-onboarding", userId);
    const agent = `agt_${Math.random().toString(36).slice(2)}`;
    return this.save(userId, { trialApiKeyId: k.id, trialAgentTokenId: agent });
  }

  generateInstall(userId: string, integration: IntegrationType, apiKey: string, agentToken: string): OnboardingState {
    const t = installTemplate(integration, apiKey, agentToken);
    return this.save(userId, { integrationType: integration, installInstructions: t.instructions, quickstartCommand: t.quickstart });
  }

  verifyHeartbeat(userId: string): OnboardingState { return this.save(userId, { firstHeartbeatAt: new Date().toISOString() }); }
  verifyEvent(userId: string): OnboardingState { return this.save(userId, { firstEventAt: new Date().toISOString() }); }
  complete(userId: string): OnboardingState { return this.save(userId, { completedAt: new Date().toISOString() }); }

  private save(userId: string, patch: Partial<OnboardingState>): OnboardingState {
    const merged = { ...this.get(userId), ...patch };
    states.set(userId, merged);
    return merged;
  }
}
