import { NextFunction, Request, Response } from "express";
import { hasRole, Role } from "../rbac";
import { validateSession } from "../session-store";
import { verifyToken } from "../jwt";

export async function requireJwt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.header("authorization")?.replace("Bearer ", "");
    if (!token) { res.status(401).json({ error: "missing bearer token" }); return; }
    const claims = await verifyToken(token);
    if (!(await validateSession(claims.sessionId))) { res.status(401).json({ error: "session expired" }); return; }
    (req as any).auth = claims;
    next();
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
}

export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const claims = (req as any).auth;
    if (!claims || !hasRole(role, claims.role)) { res.status(403).json({ error: "insufficient role" }); return; }
    next();
  };
}
