import { SubscriptionState } from "../providers/types";

export class SubscriptionStateStore {
  private state = new Map<string, { status: SubscriptionState; graceUntil?: string }>();
  setSubscriptionState(subscriptionId: string, status: SubscriptionState): void {
    const cur = this.state.get(subscriptionId) ?? { status };
    this.state.set(subscriptionId, { ...cur, status });
  }
  markGrace(subscriptionId: string, until: string): void {
    const cur = this.state.get(subscriptionId) ?? { status: "past_due" as SubscriptionState };
    this.state.set(subscriptionId, { ...cur, graceUntil: until });
  }
  get(subscriptionId: string) { return this.state.get(subscriptionId); }
}
