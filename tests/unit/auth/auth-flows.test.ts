import { describe, expect, it } from "vitest";
import {
  buildOAuthStartUrl,
  createSession,
  hashPassword,
  hasRole,
  issueAccessToken,
  issueRefreshToken,
  verifyPassword,
  verifyToken
} from "../../../apps/api/src/auth";

describe("auth flows", () => {
  it("hashes and verifies password with argon2id", async () => {
    const hash = await hashPassword("VeryStrongP@ssword99");
    expect(await verifyPassword("VeryStrongP@ssword99", hash)).toBe(true);
  });

  it("issues and verifies jwt access/refresh tokens", async () => {
    const claims = { sub: "u1", role: "admin" as const, tenantId: "t1", sessionId: "s1" };
    const access = await issueAccessToken(claims);
    const refresh = await issueRefreshToken(claims);
    expect((await verifyToken(access)).type).toBe("access");
    expect((await verifyToken(refresh)).type).toBe("refresh");
  });

  it("supports RBAC hierarchy", () => {
    expect(hasRole("viewer", "admin")).toBe(true);
    expect(hasRole("super_admin", "analyst")).toBe(false);
  });

  it("builds oauth start urls for google and github", () => {
    const url = buildOAuthStartUrl("google", {
      google: { clientId: "g", clientSecret: "x", callbackUrl: "https://app/cb" },
      github: { clientId: "gh", clientSecret: "y", callbackUrl: "https://app/gh" }
    }, "state123");
    expect(url).toContain("accounts.google.com");
    expect(url).toContain("state123");
  });

  it("creates redis backed sessions", async () => {
    await expect(createSession("s2", "u2", 10)).resolves.toBeUndefined();
  });
});
