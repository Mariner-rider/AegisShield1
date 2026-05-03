import { z } from "zod";

export const roleMapSchema = z.object({ attribute: z.string().min(1), map: z.record(z.string()), defaultRole: z.enum(["owner", "admin", "analyst", "developer", "read_only"]) });
export const samlConfigSchema = z.object({ metadataXml: z.string().min(20), entityId: z.string().optional() });
export const oidcConfigSchema = z.object({ issuer: z.string().url(), clientId: z.string().min(3), clientSecret: z.string().min(8) });
