import { generateToken, hashSecret, verifySecret } from "../auth/security";
import { z } from "zod";

type Id = string;
const randId = () => Math.random().toString(36).slice(2);

const users = new Map<string, any>();
const orgs = new Map<string, any>();
const tenants = new Map<string, any>();
const projects = new Map<string, any>();
const envs = new Map<string, any>();
const apiKeys = new Map<string, any>();
const subs = new Map<string, any>();
const trials = new Map<string, any>();

export const signupSchema = z.object({ email: z.string().email(), password: z.string().min(12), fullName: z.string().min(2) });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export class PlatformService {
  signup(input: unknown) {
    const p = signupSchema.parse(input);
    const id = randId();
    users.set(id, { id, email: p.email.toLowerCase(), fullName: p.fullName, passwordHash: hashSecret(p.password), role: "owner" });
    return { id, email: p.email, fullName: p.fullName };
  }

  login(input: unknown) {
    const p = loginSchema.parse(input);
    const user = [...users.values()].find((u: any) => u.email === p.email.toLowerCase());
    if (!user || !verifySecret(p.password, user.passwordHash)) throw new Error("invalid credentials");
    return { accessToken: generateToken(), userId: user.id, role: user.role };
  }

  createOrganization(userId: Id, name: string, slug: string) {
    const id = randId(); orgs.set(id, { id, name, slug, ownerId: userId }); return orgs.get(id);
  }
  createTenant(orgId: Id, name: string, tenantKey: string) {
    const id = randId(); tenants.set(id, { id, organizationId: orgId, name, tenantKey }); return tenants.get(id);
  }
  createProject(tenantId: Id, name: string, slug: string) {
    const id = randId(); projects.set(id, { id, tenantId, name, slug }); return projects.get(id);
  }
  createEnvironment(tenantId: Id, projectId: Id, type: string, name: string) {
    const project = projects.get(projectId); if (!project || project.tenantId !== tenantId) throw new Error("tenant isolation violation");
    const id = randId(); envs.set(id, { id, projectId, type, name }); return envs.get(id);
  }
  issueApiKey(tenantId: Id, label: string, createdBy: Id) {
    const raw = `ak_${generateToken(24)}`; const id = randId();
    apiKeys.set(id, { id, tenantId, label, createdBy, keyPrefix: raw.slice(0, 10), secretHash: hashSecret(raw), revokedAt: null });
    return { id, token: raw, keyPrefix: raw.slice(0, 10) };
  }
  rotateApiKey(tenantId: Id, keyId: Id, createdBy: Id) {
    const old = apiKeys.get(keyId); if (!old || old.tenantId !== tenantId) throw new Error("not found"); old.revokedAt = new Date().toISOString();
    return this.issueApiKey(tenantId, `${old.label}-rotated`, createdBy);
  }
  revokeApiKey(tenantId: Id, keyId: Id) { const k = apiKeys.get(keyId); if (!k || k.tenantId !== tenantId) throw new Error("not found"); k.revokedAt = new Date().toISOString(); return { revoked: true }; }
  subscriptionStatus(orgId: Id) { return [...subs.values()].find((s:any)=>s.organizationId===orgId) ?? null; }
  startTrial(orgId: Id) {
    const now = Date.now(); const rec = { id: randId(), organizationId: orgId, startsAt: new Date(now).toISOString(), endsAt: new Date(now + 30*86400000).toISOString(), status: "active" };
    trials.set(rec.id, rec); return rec;
  }
}
