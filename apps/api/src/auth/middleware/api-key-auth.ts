import { NextFunction, Request, Response } from "express";
import { verifySecret } from "../security";

const apiKeyStore = new Map<string, string>();

export function registerApiKey(prefix: string, secretHash: string): void {
  apiKeyStore.set(prefix, secretHash);
}

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const key = req.header("x-api-key");
  if (!key || key.length < 10) { res.status(401).json({ error: "missing api key" }); return; }
  const prefix = key.slice(0, 10);
  const hash = apiKeyStore.get(prefix);
  if (!hash || !verifySecret(key, hash)) { res.status(401).json({ error: "invalid api key" }); return; }
  next();
}
