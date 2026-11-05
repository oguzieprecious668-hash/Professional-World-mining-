# Deployment guide: backend-capable hosting

This is a deployment outline, not a production certification. Do not deploy the repository's static demo as a real account or financial service. The new Next.js preview, API skeleton, and schema have no account lifecycle endpoints, no implemented provider KYC integration, and no money movement.

## Host layout

Deploy `apps/web` as a Next.js Node application on a host that supports server rendering, Auth.js callbacks, secure cookies, and server-side environment variables. Deploy `apps/api` as a separate Node service. Use a managed PostgreSQL instance with TLS and private networking if available. GitHub Pages cannot host the API or protect private routes.

## Identity provider setup

- Create distinct OIDC applications for local development, staging, and production.
- Configure Authorization Code flow with PKCE and exact callback/logout URLs; do not use wildcard callbacks.
- Issue API audience-specific access tokens with trusted `roles` and MFA method (`amr`) claims, after confirming the provider's claim formats.
- Keep client secrets only in the hosting platform's secret manager.
- Enable MFA and secure account recovery for staff; use least-privilege roles and a separate process to grant admin permissions.
- Configure `AUTH_SECRET` as a unique high-entropy secret. Set production `AUTH_URL` to the canonical HTTPS origin.

## API environment

Set `NODE_ENV=production`, `API_PORT` per host, `WEB_ORIGIN` to the exact frontend origin, and `OIDC_ISSUER`, `OIDC_AUDIENCE`, `OIDC_JWKS_URL` to validated provider values. Set `DATABASE_URL` from the managed database secret store. Configure CORS to exactly the frontend origin. Never expose API/JWKS configuration secrets, database credentials, or provider keys to `NEXT_PUBLIC_*` variables.

The example API accepts bearer JWTs for its protected endpoint. Before using it beyond a skeleton, implement audience/scope separation, server-side role assignment/lookup, revocation/session lifecycle, schema validation, audit records, monitoring, and tests. The API's current roles claim must be issued by the trusted IdP; never derive admin permission from user-supplied data.

## Database and migrations

- Provision managed PostgreSQL with TLS, backups, restore testing, restricted network access, and a least-privilege application role.
- Apply reviewed Prisma migrations from CI/CD using a separate migration credential; do not run `prisma migrate dev` in production.
- The current minimal schema stores OIDC subject, email, roles, KYC provider reference/status, and audit metadata only. It deliberately omits document images, raw provider payloads, wallet keys, and financial ledgers.
- Establish data retention/deletion and privacy policies before collecting personal data.

## KYC provider flow

Select a contracted provider only after legal/privacy review. Implement a backend adapter that creates short-lived hosted sessions, validates signed webhooks with replay/idempotency checks, and stores only minimal provider reference/status metadata. Never upload identity documents to GitHub Pages or this starter API. Configure provider callback URLs and signing secrets in a managed secret store. Review provider scopes, data residency, retention, and access controls before going live.

## CI and release gates

1. Pin dependencies and commit a reviewed lockfile.
2. Run typecheck, unit/integration tests, dependency and secret scanning, and a production build.
3. Review authorization tests for unauthenticated, regular user, support, reviewer, and admin roles; test MFA-required behavior and revoked sessions.
4. Deploy to staging with synthetic data; verify TLS, security headers, CORS, logs, backup/restore, and alerting.
5. Obtain independent application security testing and jurisdiction-specific legal/compliance approval before onboarding real customers.

No deposits, withdrawals, custody, trading, staking, paid investment plans, or profit projections are implemented. Do not enable financial features based on this scaffold alone.
