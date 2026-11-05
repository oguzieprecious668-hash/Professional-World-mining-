/**
 * Authorization boundary example. The identity claims MUST come from a verified
 * server-side OIDC session/token, never from browser-submitted role data.
 */
export type AppRole =
  | "USER"
  | "SUPPORT"
  | "COMPLIANCE_REVIEWER"
  | "ADMIN";

export interface VerifiedPrincipal {
  subject: string;
  roles: readonly AppRole[];
  mfaAuthenticated: boolean;
}

export class ForbiddenError extends Error {
  readonly statusCode = 403;
  constructor(message = "Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Call after cryptographic token/session verification on every protected API request. */
export function requireRole(
  principal: VerifiedPrincipal | null,
  allowedRoles: readonly AppRole[],
  requireMfa = false,
): VerifiedPrincipal {
  if (!principal) throw new ForbiddenError("Authentication required");
  if (requireMfa && !principal.mfaAuthenticated) {
    throw new ForbiddenError("MFA required");
  }
  if (!principal.roles.some((role) => allowedRoles.includes(role))) {
    throw new ForbiddenError();
  }
  return principal;
}
