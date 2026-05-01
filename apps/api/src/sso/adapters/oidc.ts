import { OidcConfigInput } from "../types";

export function validateOidcConfig(input: OidcConfigInput): boolean {
  return /^https:\/\//.test(input.issuer) && input.clientId.length > 2 && input.clientSecret.length > 8;
}

export function parseOidcClaims(claims: Record<string, unknown>, roleClaim: string): string | undefined {
  const v = claims[roleClaim];
  return typeof v === "string" ? v : undefined;
}
