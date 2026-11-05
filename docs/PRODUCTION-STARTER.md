# ProfessionalMining production starter — readiness and implementation plan

> **Status: planning scaffold, not a production service.** The current repository contains static demo pages. They must not be used to collect credentials, identity documents, payments, deposits, or withdrawal instructions. This document defines a safer path for a legitimate, compliance-reviewed product; it does not provide financial services or guarantee approval by a regulator or provider.

## Important repository warning

The existing static `admin.html` is public and is not an authenticated admin system. Browser `localStorage` is not a safe place for passwords, roles, account records, or KYC data. Demo balances, prices, transactions, plans, and returns are not verified real data. Do not invite customers to register, upload ID, or send funds through these pages. Before any public launch, replace the demo forms/data and add an unmistakable demo notice or remove those pages.

## Proposed architecture

- **Web app:** Next.js, hosted on a platform that supports server-side rendering and protected server routes. GitHub Pages may host only the non-sensitive informational site; it cannot protect an admin page or host a trusted backend.
- **API:** Node.js/NestJS or Django REST API deployed separately. All authorization checks happen on the server for every request.
- **Identity:** established identity provider or thoroughly reviewed server-side session implementation, with email verification, secure password hashing, CSRF protections, rate limits, recovery controls, and MFA. Do not store passwords or access tokens in browser storage.
- **Database:** managed PostgreSQL with private networking where available, encryption at rest, encrypted backups, least-privilege service credentials, migrations, retention rules, and tested restore procedures.
- **KYC:** use a contracted, legally reviewed provider's hosted verification flow. Store only provider reference and minimal status metadata in this application. Do not accept ID uploads on GitHub Pages or store raw identity documents in this repository or ordinary application storage.
- **Support:** use a dedicated helpdesk provider or a server-backed contact form with abuse protection and retention policy. The static demo chat is not connected to support staff.
- **Financial activity:** no wallet custody, deposit address, withdrawal, investment plan, staking, trading, or returns feature is included in this starter. Do not enable money movement until qualified legal/compliance review and a licensed provider's written onboarding are complete. Any balances shown in development must be visibly marked simulated.
- **Observability:** security event logging, alerting, dependency scanning, incident response, and an audit trail that avoids recording secrets or identity documents.

## Suggested service boundaries

1. `web`: public company/product information, sign-up and login UI, authenticated account UI.
2. `api`: authentication, account profile, authorization, provider callbacks, and audit events.
3. `database`: user identifiers, role assignments, KYC provider references/status, and operational audit metadata only.
4. `identity-provider`: hosted identity verification and MFA where supported.
5. `support-provider`: customer support system with a retention and access policy.

Do not expose database, provider, or signing secrets to frontend bundles. Use deployment secret management and separate development/staging/production environments.

## Data model boundaries (design only)

- `users`: UUID, normalized email, identity-provider subject, account status, timestamps.
- `roles` / `user_roles`: server-controlled role and permission assignments; never accept role selection from public registration.
- `kyc_cases`: user UUID, provider name, provider case reference, status, timestamps; no ID image, selfie, document number, or full provider payload.
- `audit_events`: actor UUID, action, target type/ID, timestamp, request correlation ID; redact tokens, passwords, and sensitive PII.
- `support_cases`: provider reference and minimal routing metadata; message contents belong in the chosen support provider under its retention controls.

Financial ledger and wallet tables are deliberately omitted: there is no approved financial provider, custody model, accounting policy, or compliance scope in this repository.

## Security and launch gates

Before handling real registrations:

- Select the backend, identity provider, database host, and jurisdiction; review contracts, privacy terms, and data-processing locations.
- Threat-model authentication, account recovery, admin access, provider callbacks, and abuse scenarios.
- Require MFA for staff; use least privilege and separate staff roles; require step-up verification for sensitive administrative actions.
- Test authorization on the server, session invalidation, rate limiting, CSRF protections, secure cookies, security headers, and account recovery.
- Set privacy notice, terms, retention/deletion policy, incident response, backups, and support access procedures.
- Obtain independent security review and legal/compliance review before launch.

Before any KYC onboarding, use a hosted provider flow and complete data protection and regulatory review. Never use public GitHub Pages forms for identity documents.

Before any financial functionality, obtain jurisdiction-specific legal advice, provider approval, operational controls, reconciliation/ledger design, sanctions/fraud controls, and an independent security review. This repository does not implement that functionality.

## Local repository status

The current root HTML/CSS/JavaScript demo remains separate from any production service. It has no trustworthy authentication, private admin access, server-side storage, KYC provider integration, or financial processing. Do not describe it as production-ready. A real implementation should be developed in a separate environment, reviewed, and deployed to suitable backend-capable hosting; GitHub Pages is not the production backend.
