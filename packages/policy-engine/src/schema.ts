import { z } from "zod";

export const ActionSchema = z.enum([
  "block_request",
  "challenge_request",
  "quarantine_session",
  "revoke_token",
  "disable_risky_route",
  "switch_read_only",
  "notify_operators",
  "create_immutable_incident"
]);

export const ConditionSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(["eq", "neq", "gt", "gte", "lt", "lte", "contains", "in"]),
  value: z.any()
});

export const PolicyRuleSchema = z.object({
  id: z.string().min(3),
  description: z.string().min(5),
  enabled: z.boolean().default(true),
  priority: z.number().int().min(1).max(1000),
  conditions: z.array(ConditionSchema).min(1),
  actions: z.array(ActionSchema).min(1)
});

export const PolicyBundleSchema = z.object({
  version: z.string().regex(/^v\d+\.\d+\.\d+$/),
  createdAt: z.string(),
  rules: z.array(PolicyRuleSchema).min(1),
  rollbackTo: z.string().optional()
});

export type PolicyBundle = z.infer<typeof PolicyBundleSchema>;
