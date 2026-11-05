# Local development

Requirements: Docker Desktop (or Docker Engine + Compose), Node.js 22 for local tooling, and a development OIDC provider/application. No production credentials should be used locally.

1. Copy `apps/api/.env.example` to `apps/api/.env` and `apps/web/.env.example` to `apps/web/.env.local`.
2. Configure development-only OIDC issuer, client ID/secret, audience, and JWKS URL. Set the identity provider callback/redirect URI to `http://localhost:3000/api/auth/callback/workforce-oidc` and configure trusted `roles` plus `amr` claims. Verify actual MFA claim semantics with your provider before relying on them.
3. From this directory, start services with `docker compose up`. The web UI is at `http://localhost:3000`, API health at `http://localhost:4000/health`, and PostgreSQL is bound to loopback only.
4. Install dependencies/generate Prisma client in a local Node environment if needed: `npm install`, `npm run db:generate`, `npm run typecheck`.

The local API currently has a health route and a JWT/MFA-protected example admin health route. The Prisma model is a reference schema; no database-backed account or KYC endpoints are implemented. The KYC provider interface is an adapter contract only. This is not a production-ready auth or identity-verification service.

For production, do not copy the development secrets. Use separate secret-manager values and a managed database with private access. Run schema migrations as a controlled deployment step after review, not automatically at service startup.
