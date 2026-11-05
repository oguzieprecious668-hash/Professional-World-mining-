import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";
import { requireAdminMfa, type AuthenticatedRequest } from "./security.js";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().url(),
  OIDC_ISSUER: z.string().url(),
  OIDC_AUDIENCE: z.string().min(1),
  OIDC_JWKS_URL: z.string().url(),
});

const env = envSchema.parse(process.env);
const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true, methods: ["GET", "POST", "PATCH", "DELETE"] }));
app.use(express.json({ limit: "32kb", type: "application/json" }));
app.use(rateLimit({ windowMs: 60_000, limit: 100, standardHeaders: "draft-8", legacyHeaders: false }));

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

// Example protected admin boundary. Add a server-side role store and audit record
// before exposing any real administrative operation.
app.get("/v1/admin/health", requireAdminMfa({
  issuer: env.OIDC_ISSUER,
  audience: env.OIDC_AUDIENCE,
  jwksUrl: env.OIDC_JWKS_URL,
}), (req: AuthenticatedRequest, res) => {
  res.json({ status: "authorized", subject: req.principal?.subject });
});

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.listen(env.API_PORT, () => {
  console.info(`API listening on port ${env.API_PORT}`);
});
