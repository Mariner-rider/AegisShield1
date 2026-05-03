import { generateToken, hashSecret, verifySecret } from "../auth/security";
import { z } from "zod";
import { prisma } from "../db/client";

type Id = string;

export const signupSchema = z.object({ email: z.string().email(), password: z.string().min(12), fullName: z.string().min(2), tenantId: z.string().optional() });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export class PlatformService {
  async signup(input: unknown) {
    const p = signupSchema.parse(input);
    const tenant = p.tenantId ? await prisma.tenant.findUnique({ where: { id: p.tenantId } }) : await prisma.tenant.create({ data: { name: `${p.fullName}'s tenant`, tenantKey: `t_${generateToken(10)}` } });
    const user = await prisma.user.create({ data: { tenantId: tenant!.id, email: p.email.toLowerCase(), fullName: p.fullName, passwordHash: hashSecret(p.password), role: "owner" } });
    return { id: user.id, email: user.email, fullName: user.fullName, tenantId: user.tenantId };
  }

  async login(input: unknown) {
    const p = loginSchema.parse(input);
    const user = await prisma.user.findUnique({ where: { email: p.email.toLowerCase() } });
    if (!user || !verifySecret(p.password, user.passwordHash)) throw new Error("invalid credentials");
    return { accessToken: generateToken(), userId: user.id, role: user.role, tenantId: user.tenantId };
  }

  async createOrganization(userId: Id, name: string, slug: string) {
    return prisma.auditLog.create({ data: { tenantId: userId, actor: userId, action: "organization.create", targetType: "organization", targetId: slug, immutableHash: hashSecret(`${name}:${slug}`), metadata: { name } } });
  }
  async createTenant(_orgId: Id, name: string, tenantKey: string) { return prisma.tenant.create({ data: { name, tenantKey } }); }
  async createProject(tenantId: Id, name: string, slug: string) { return prisma.auditLog.create({ data: { tenantId, actor: "system", action: "project.create", targetType: "project", targetId: slug, immutableHash: hashSecret(`${name}:${slug}`), metadata: { name } } }); }
  async createEnvironment(tenantId: Id, projectId: Id, type: string, name: string) { return prisma.auditLog.create({ data: { tenantId, actor: "system", action: "environment.create", targetType: "environment", targetId: projectId, immutableHash: hashSecret(`${type}:${name}`), metadata: { type, name } } }); }
  async issueApiKey(tenantId: Id, label: string, createdBy: Id) {
    const raw = `ak_${generateToken(24)}`;
    const key = await prisma.apiKey.create({ data: { tenantId, createdById: createdBy, label, keyPrefix: raw.slice(0, 10), secretHash: hashSecret(raw) } });
    return { id: key.id, token: raw, keyPrefix: key.keyPrefix };
  }
  async rotateApiKey(tenantId: Id, keyId: Id, createdBy: Id) {
    await prisma.apiKey.update({ where: { id: keyId }, data: { revokedAt: new Date() } });
    return this.issueApiKey(tenantId, "rotated", createdBy);
  }
  async revokeApiKey(_tenantId: Id, keyId: Id) { await prisma.apiKey.update({ where: { id: keyId }, data: { revokedAt: new Date() } }); return { revoked: true }; }
  async subscriptionStatus(tenantId: Id) { return prisma.subscription.findUnique({ where: { tenantId } }); }
  async startTrial(tenantId: Id) {
    const now = new Date(); const ends = new Date(now.getTime() + 30 * 86400000);
    return prisma.subscription.upsert({ where: { tenantId }, update: { status: "TRIAL", startsAt: now, endsAt: ends }, create: { tenantId, plan: "trial", status: "TRIAL", startsAt: now, endsAt: ends } });
  }
}
