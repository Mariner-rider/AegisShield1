import express from "express";
import helmet from "helmet";
import { createMiddleware } from "../../../packages/sdk/src/middleware";

const app = express();
app.use(express.json({ limit: "100kb" }));
app.use(helmet({ contentSecurityPolicy: { useDefaults: true } }));
app.use(createMiddleware());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.post("/login", (_req, res) => res.json({ success: true }));
app.get("/admin/panel", (_req, res) => res.json({ admin: true }));

app.listen(3000, () => console.log("AegisShield example listening on :3000"));
