import { weeklySafeUpdate } from "../services/intel-ingestor/src";

const fetched = [
  { id: "ioc-1", source: "advisory", type: "ioc", value: "198.51.100.23", severity: "high", observedAt: new Date().toISOString() },
  { id: "rec-1", source: "advisory", type: "recommendation", value: "tighten admin policy", severity: "medium", observedAt: new Date().toISOString() }
] as any;

const safe = weeklySafeUpdate(fetched);
console.log("Applying low-risk intel records:", safe.map((r: any) => r.id));
