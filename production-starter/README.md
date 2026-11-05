# Production architecture outline (reference scaffold)

This directory is a **design/code outline, not a deployable production service**. It intentionally does not implement password collection, KYC document upload/storage, wallet custody, deposits, withdrawals, trading, staking, or investment returns. Do not market the existing demo as a live financial product.

## Boundary and deployment

```text
Browser
  └── Next.js web app (public pages + account UI)
       ├── redirects sign-in to an OIDC identity provider
       └── calls server API with secure, short-lived session

Node.js API (NestJS/Fastify) ── managed PostgreSQL
  ├── verifies identity-provider token/session on every request
  ├── enforces roles on the server (never trust UI state)
  ├── starts hosted KYC sessions through a contracted provider
  └── stores minimal KYC status/reference and audit metadata only

Identity/MFA provider ── hosted KYC provider ── support provider
```

GitHub Pages is suitable only for static public information. It cannot provide private routes, backend authorization, secure session handling, or trusted KYC processing. Deploy Next.js and the API to backend-capable hosting; keep secrets server-side. Separate development, staging, and production credentials and databases.

## Suggested layout

```text
apps/
  web/                 # Next.js pages and UI; no secrets or sensitive localStorage
  api/                 # Node API; OIDC validation, authorization, provider callbacks
packages/
  contracts/           # shared request/response types (no secrets)
prisma/
  schema.prisma        # minimal account, KYC reference, and audit metadata
infra/
  README.md            # deploy plan; use managed secret store, not committed secrets
```

The `schema.prisma` next to this README is a minimal data-model example. It intentionally has no wallet or transaction ledger and no columns for identity images, selfies, document numbers, passwords, MFA secrets, or access tokens.

## Authentication and authorization contract

Use a well-supported OIDC identity provider that supports MFA and secure account recovery. The web app should use a server-side session with `HttpOnly`, `Secure`, and appropriate `SameSite` cookies. Never keep passwords, refresh tokens, role claims, or admin decisions in `localStorage`.

The API must verify the session/token and check permissions for every protected request. UI route hiding is only presentation, not security. Do not provide public registration with a selectable admin/staff role; staff role assignment must be a separately authorized operation with audit logging.

A small authorization contract (not a complete auth implementation) is in `src/access-control.ts`. Connect it to verified identity-provider claims and server-side role records; fail closed if verification is unavailable.

## KYC flow outline

1. An authenticated user requests verification.
2. API checks account status and creates a short-lived hosted verification session using the provider's server SDK.
3. User is redirected to the provider's hosted flow. Do not accept ID files in the static site or API.
4. Provider calls a signed webhook. Verify signature, timestamp, and replay/idempotency controls before updating the case status.
5. Store only provider name, opaque case reference, status, and timestamps. Do not persist the provider's raw payload or document images.
6. Admin review requires server-side staff role and MFA. Every decision is audited; restrict KYC detail access to staff who need it.

`src/kyc-provider.ts` documents the provider adapter boundary only. It has no provider credentials or working integration. Provider choice, contract, retention, privacy impact assessment, webhook setup, and jurisdictional review are required before implementation.

## Database and operations

- Use managed PostgreSQL with private connectivity, encryption at rest, encrypted backups, least-privilege credentials, migrations, and tested restore procedures.
- Minimize personal data and define retention/deletion rules before collecting it.
- Audit events should avoid secrets, document contents, full provider payloads, and unnecessary personal data.
- Add rate limiting, CSRF defenses where cookie auth is used, secure headers, dependency scanning, monitoring, alerting, and an incident response process.
- Require independent security review and legal/compliance review before accepting real customers.

## No financial functionality

This outline does not implement money movement, custody, an investment product, or performance claims. Do not add these features until jurisdiction-specific legal/compliance review, provider approval, an audited ledger/reconciliation design, operational controls, and independent security assessment are complete. All values in the existing static demo must be treated as fictional and clearly labeled simulated.

## Next implementation steps

1. Select jurisdiction, backend host, OIDC provider, managed Postgres, KYC vendor, and support system.
2. Review vendors/contracts and complete threat modeling and privacy/compliance assessment.
3. Implement and test authentication, MFA enrollment/recovery, authorization, account lifecycle, and audit controls in a separate staging environment.
4. Integrate the hosted KYC flow and signed webhooks; confirm data minimization and retention.
5. Perform independent security and compliance reviews before any production launch.

Never commit `.env` files, API keys, signing keys, provider credentials, or real user data. Use the hosting provider's secret manager.
