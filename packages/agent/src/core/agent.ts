import { AgentConfig, AgentState } from "./types";

export class LightweightAgent {
  private state: AgentState = { enrolled: false, health: "starting" };

  constructor(private readonly config: AgentConfig) {}

  async enroll(): Promise<AgentState> {
    // mocked enrollment token exchange + environment binding
    this.state = { ...this.state, enrolled: true, bindingId: `bind_${this.config.environmentId}`, health: "healthy" };
    return this.state;
  }

  async heartbeat(): Promise<AgentState> {
    this.state = { ...this.state, lastHeartbeatAt: new Date().toISOString(), health: this.state.enrolled ? "healthy" : "degraded" };
    return this.state;
  }

  async syncPolicy(): Promise<string> {
    const version = `v${new Date().getTime()}`;
    this.state = { ...this.state, lastPolicyVersion: version };
    return version;
  }

  reportHealth(): AgentState { return this.state; }
}
