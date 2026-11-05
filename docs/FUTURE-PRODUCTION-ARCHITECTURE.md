# Future production architecture — planning document

**Status:** architecture planning only. This document does not approve a business model, regulatory status, vendor, or production launch. The repository's current public site remains an educational, static mockup and must not collect customer data or funds.

## 1. Decisions required before implementation

Before selecting technology or enabling customer onboarding, qualified counsel and compliance professionals should establish:

- The legal entity, exact service, jurisdictions, target users, and applicable regulatory obligations.
- Whether the proposed activities require licensing, registration, consumer disclosures, AML/sanctions controls, custody controls, or other authorization.
- Privacy controller/processor responsibilities, data residency, retention/deletion periods, and incident-notification obligations.
- The operating model and accountable owners for security, compliance, customer support, risk, and incident response.
- Whether a regulated third-party provider can lawfully support each activity in the relevant jurisdiction.

No provider should be represented as approved or selected by this repository. Do not launch or solicit users until the above decisions and reviews are documented.

## 2. Logical architecture (future, subject to review)

```text
Public information site (static, no personal-data forms)
        |
Authenticated web application (server-rendered, secure session)
        |
Backend API (authorization, validation, audit, rate limits)
        |---------------------|-----------------------|
Managed PostgreSQL      OIDC identity provider    Hosted KYC provider
(minimal metadata)      (MFA, recovery)            (provider-hosted flow)
        |
Centralized security monitoring and privacy-controlled audit events
```

A static hosting service such as GitHub Pages is suitable only for public informational content. It cannot protect admin routes, validate a session, enforce roles, run trusted backend code, or receive sensitive identity submissions securely.

## 3. Identity and access controls

- Use a reputable OIDC identity provider with authorization-code flow and PKCE. Use exact redirect URIs, distinct environments, strong recovery controls, and staff MFA.
- Use server-managed sessions with `HttpOnly`, `Secure`, and suitable `SameSite` cookie settings; protect state-changing requests against CSRF.
- Verify issuer, audience, signature, expiry, nonce/state, and required authentication context. Never trust roles or MFA flags supplied by the browser.
- Enforce role/permission checks on every API operation. Keep admin role assignment separate, approval-controlled, least-privileged, and audited.
- Test session expiry/revocation, account recovery, rate limiting, lockout/abuse handling, and authorization boundaries.

## 4. Data minimization and KYC

- Prefer a contracted provider-hosted identity flow; the application should not receive or store raw ID images, selfie images, document numbers, or full provider payloads.
- Store only the minimum provider reference, normalized status, timestamps, and internal case identifier necessary for the approved purpose.
- Verify provider webhooks cryptographically and add timestamp, idempotency, and replay defenses. Do not expose webhook secrets to the frontend.
- Restrict status/detail access to specifically authorized staff. Keep sensitive provider content in the provider's reviewed system under contract, retention, access, and deletion controls.
- Complete privacy-impact, vendor, security, and jurisdictional assessments before processing any personal data.

## 5. Database and audit design

- Use managed PostgreSQL with private networking where possible, TLS, encryption at rest, encrypted backups, least-privilege roles, monitored access, and tested restore procedures.
- Apply reviewed, versioned schema migrations through deployment pipelines; separate migration credentials from runtime credentials.
- Keep an append-only, access-controlled audit trail for privileged actions. Record actor, action, target, time, and correlation ID; exclude passwords, tokens, document contents, and unnecessary personal data.
- Define retention/deletion and legal-hold processes before collecting real user information.
- Do not create a wallet, custody, payments, transaction ledger, or returns model until the legal/business scope and provider controls are independently determined and reviewed.

## 6. Application security and operations

- Separate public, development, staging, and production environments and credentials. Use the host's secret manager; never commit secrets or place them in client-side `NEXT_PUBLIC_*` variables.
- Use HTTPS, security headers, strict CORS, input validation, rate limits, dependency pinning/scanning, secret scanning, and centralized alerting.
- Define incident response, access reviews, vulnerability disclosure, backups, disaster recovery, and tested rollback procedures.
- Require threat modeling, automated authorization tests, independent penetration testing, privacy review, and legal/compliance approval before a production launch.

## 7. Deployment topology

A future service may use a server-rendering-capable host for the web app, a separate private Node API service, and a managed PostgreSQL database. Exact vendors must be selected through security, privacy, reliability, contractual, and jurisdiction-specific review. Use private service-to-service networking, TLS, managed secrets, health checks, logging with redaction, and controlled migration jobs. Keep the public GitHub Pages mockup separate from all production services.

## 8. Launch gates

Production onboarding remains disabled until all are true:

1. Legal/compliance scope and required authorizations are documented by qualified professionals.
2. Identity/KYC/provider contracts and privacy-impact reviews are complete.
3. Independent security assessment has no unresolved critical/high findings.
4. Authentication, MFA, roles, audit trail, data retention, support, and incident response are tested.
5. Production data deletion, backup recovery, monitoring, and escalation paths are operational.
6. Customer-facing claims, disclosures, and support workflows have been reviewed and approved.

Nothing in this planning document constitutes legal, investment, or security advice or a certification of compliance.
