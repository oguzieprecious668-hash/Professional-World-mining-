import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

export interface Principal {
  subject: string;
  roles: string[];
  mfaAuthenticated: boolean;
}

export interface AuthenticatedRequest extends Request {
  principal?: Principal;
}

interface AuthConfig {
  issuer: string;
  audience: string;
  jwksUrl: string;
}

function hasMfa(payload: JWTPayload): boolean {
  // Configure the IdP to issue a trusted `amr` value after successful MFA.
  // Confirm the provider's exact claim semantics before production use.
  const methods = payload.amr;
  return Array.isArray(methods) && methods.some((method) => method === "mfa" || method === "otp");
}

export function requireAdminMfa(config: AuthConfig) {
  const jwks = createRemoteJWKSet(new URL(config.jwksUrl));

  return async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.header("authorization");
    const match = auth?.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ error: "Authentication required" });

    try {
      const { payload } = await jwtVerify(match[1], jwks, {
        issuer: config.issuer,
        audience: config.audience,
        algorithms: ["RS256", "ES256"],
      });
      const roles = Array.isArray(payload.roles)
        ? payload.roles.filter((role): role is string => typeof role === "string")
        : [];
      if (!roles.includes("ADMIN")) return res.status(403).json({ error: "Forbidden" });
      if (!hasMfa(payload)) return res.status(403).json({ error: "MFA required" });
      (req as AuthenticatedRequest).principal = {
        subject: String(payload.sub ?? ""),
        roles,
        mfaAuthenticated: true,
      };
      return next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired credentials" });
    }
  };
}
