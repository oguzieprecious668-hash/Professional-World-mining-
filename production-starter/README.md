# Dev-only technical starter

This folder is an **unfinished development scaffold** for testing web/API boundaries locally. It is not a production service, is not deployed, and is not approved to process real people or money. The root public site remains an educational mockup.

## Included

- Next.js sample informational UI and example protected route structure.
- Express API skeleton with OIDC JWT verification example and an admin/MFA guard example.
- Prisma reference schema for identity subject, basic account status/roles, minimal KYC provider reference/status, and audit metadata.
- Docker Compose local development configuration.
- Deployment planning notes only.

## Not implemented or approved

- A complete authentication lifecycle, account provisioning, recovery, session revocation, or admin role-management workflow.
- A connected OIDC tenant, production secrets, database migration history, KYC vendor SDK/webhooks, or operational monitoring.
- Customer registration, identity document intake, customer service, wallet custody, payments, financial ledger, deposits, withdrawals, investments, or returns.

Use synthetic test data only. Do not configure production credentials in local files or use this scaffold for real-user testing. Before any legitimate live service, follow `../docs/FUTURE-PRODUCTION-ARCHITECTURE.md` and complete qualified legal/compliance and independent security reviews.
