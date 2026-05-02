export type Role = "owner" | "admin" | "analyst" | "developer" | "billing_manager" | "read_only";
export interface User { id: string; email: string; passwordHash: string; fullName: string; deletedAt?: string | null }
export interface Organization { id: string; name: string; slug: string; deletedAt?: string | null }
export interface Tenant { id: string; organizationId: string; name: string; tenantKey: string; deletedAt?: string | null }
export interface Project { id: string; tenantId: string; name: string; slug: string; deletedAt?: string | null }
export interface Environment { id: string; projectId: string; type: "dev"|"staging"|"prod"; name: string; deletedAt?: string | null }
export interface APIKey { id: string; tenantId: string; keyPrefix: string; secretHash: string; revokedAt?: string | null }
export interface AgentToken { id: string; environmentId: string; tokenHash: string; revokedAt?: string | null }
export interface SubscriptionPlan { id: string; code: string; name: string; monthlyUsdCents: number }
export interface Subscription { id: string; organizationId: string; planId: string; status: "trialing"|"active"|"past_due"|"canceled" }
export interface Trial { id: string; organizationId: string; startsAt: string; endsAt: string; status: "active"|"expired"|"converted" }
export interface InvoiceRecord { id: string; subscriptionId: string; amountCents: number; dueAt: string }
export interface PolicyBundle { id: string; tenantId: string; version: string; signature: string }
export interface DetectionEvent { id: string; tenantId: string; severity: number; tags: string[] }
export interface ResponseAction { id: string; detectionEventId: string; action: string; status: string }
export interface AuditEvent { id: string; eventType: string; immutableHash: string; previousHash?: string | null }
