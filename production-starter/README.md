# Production starter framework

This starter now contains a Next.js preview with Auth.js OIDC sign-in and protected `/dashboard` and `/admin` route examples; an Express API that verifies JWT signatures, issuer/audience, admin role, and MFA claim; a minimal Prisma PostgreSQL schema; and Docker Compose for local development.

It is a **framework scaffold, not a finished production service**. The account lifecycle, admin business operations, KYC vendor SDK/webhook implementation, persisted session/account APIs, support backend, and deployment configuration still need implementation and review. No real money movement, wallet custody, deposits, withdrawals, investments, or return claims are included.

Use [`LOCAL-DEV.md`](LOCAL-DEV.md) for local setup and [`DEPLOYMENT.md`](DEPLOYMENT.md) for backend-host deployment guidance. Keep the existing static Pages site as informational/demo only; GitHub Pages cannot run the API or secure admin routes.
