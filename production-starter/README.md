# Development starter (local use only)

This directory is an **unfinished software scaffold** for exploring a web/API architecture. It is not deployed, production-ready, security-reviewed, or approved to process real people or money. Use synthetic data only.

> **Do not use this scaffold for customer onboarding or financial activity.** It does not provide complete account lifecycle management, KYC processing, payment or wallet services, or a functioning production admin system. The public website at the repository root is a separate educational mockup.

## What’s here

- `apps/web/` — Next.js informational UI and example protected-route structure.
- `apps/api/` — Express API skeleton with an OIDC/JWT verification example and protected sample route.
- `prisma/schema.prisma` — reference schema for account identifiers, roles, minimal KYC-provider metadata, and audit metadata.
- `docker-compose.yml` — local web/API/PostgreSQL development services.
- `LOCAL-DEV.md` — local setup notes.
- `DEPLOYMENT.md` — deployment planning checklist, not a deployment configuration.

## What is deliberately absent

- Production identity-provider configuration, complete authentication/recovery/revocation, or an admin role-management workflow.
- A connected KYC vendor, document intake, provider webhook implementation, or real identity verification.
- A completed migration history, production database, monitoring, alerting, or incident-response setup.
- Customer support workflows, wallet custody, payments, deposits, withdrawals, trading, investment products, or return calculations.

The schema is a design reference, not evidence that migrations have been applied. The KYC provider module is an interface only. The sample auth guards demonstrate boundaries but are not a security certification or a substitute for provider-specific review and tests.

## Local setup

Requirements: Docker Compose and Node.js 22. Use a dedicated development OIDC tenant if you want to exercise sign-in; do not reuse production credentials.

1. From this directory, copy `apps/api/.env.example` to `apps/api/.env` and `apps/web/.env.example` to `apps/web/.env.local`.
2. Fill in development-only identity-provider values. Configure the provider's callback URL as `http://localhost:3000/api/auth/callback/workforce-oidc`. The example expects trusted role and MFA claims; confirm claim names and semantics with your provider. Do not grant admin claims to ordinary test users.
3. Start the local services:

   ```sh
   docker compose up
   ```

4. Open the web preview at `http://localhost:3000`. The API health endpoint is `http://localhost:4000/health`.
5. For local package/type checks, from this directory run:

   ```sh
   npm install
   npm run typecheck
   npm run build
   ```

   These commands have not been represented as passing CI checks. Resolve any dependency, configuration, or integration issues before relying on the scaffold.

The Compose database is for disposable local development only. Never put real user data in it. The API has a health route and a sample JWT-protected route; it does not implement database-backed accounts or KYC operations.

## Before extending the scaffold

- Keep secrets out of source control and frontend bundles. Use local-only `.env` files and a deployment secret manager for real environments.
- Do not add password, identity-document, payment, wallet-key, or sensitive customer-data collection to the public static site.
- Add tests for authentication failures, permissions, MFA requirements, input validation, and session lifecycle before adding protected business operations.
- Treat every role and MFA claim as untrusted until the server has validated the token and the claim's meaning against the selected identity provider.
- Do not expose a route merely because the UI hides its link; authorization must be enforced by the API on every request.

## Future production work

A legitimate live service requires qualified legal/compliance review, independent security assessment, privacy and data-retention decisions, appropriate provider contracts, secure backend hosting, operational monitoring, and documented incident response. Review [`../docs/FUTURE-PRODUCTION-ARCHITECTURE.md`](../docs/FUTURE-PRODUCTION-ARCHITECTURE.md) before proposing production use. That document is a planning guide—not legal advice, approval, or a launch authorization.
