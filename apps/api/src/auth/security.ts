import crypto from "node:crypto";

export function hashSecret(secret: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(secret, salt, 64);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export function verifySecret(secret: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  const derived = crypto.scryptSync(secret, Buffer.from(saltHex, "hex"), 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hashHex, "hex"), Buffer.from(derived, "hex"));
}

export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function sanitizeUserInput(input: string): string {
  return input.replace(/[<>"'`;]/g, "").trim();
}

export function enforceMinimumSecretPolicy(secret: string): boolean {
  const hasLower = /[a-z]/.test(secret);
  const hasUpper = /[A-Z]/.test(secret);
  const hasNumber = /\d/.test(secret);
  const hasSpecial = /[^A-Za-z0-9]/.test(secret);
  return secret.length >= 14 && hasLower && hasUpper && hasNumber && hasSpecial;
}
