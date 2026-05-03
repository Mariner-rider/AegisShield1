import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev_jwt_secret_change_me");
const issuer = "aegis-api";

type Role = "super_admin" | "admin" | "analyst" | "viewer";

export interface TokenClaims { sub: string; role: Role; tenantId?: string; sessionId: string; type: "access" | "refresh"; }

export async function issueAccessToken(claims: Omit<TokenClaims, "type">): Promise<string> {
  return new SignJWT({ ...claims, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(issuer)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function issueRefreshToken(claims: Omit<TokenClaims, "type">): Promise<string> {
  return new SignJWT({ ...claims, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(issuer)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<TokenClaims> {
  const out = await jwtVerify(token, secret, { issuer });
  return out.payload as unknown as TokenClaims;
}
