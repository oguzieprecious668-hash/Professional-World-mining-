# Local development (synthetic data only)

Requirements: Docker Compose and Node.js 22. This scaffold is unfinished; it is not intended for public or production use.

1. Copy `apps/api/.env.example` to `apps/api/.env` and `apps/web/.env.example` to `apps/web/.env.local`.
2. Configure a dedicated development OIDC tenant only. Never reuse production credentials. Review the provider's claim definitions before relying on role or MFA claims.
3. Start local services with `docker compose up` from this directory. The web preview is at `http://localhost:3000`; API health check is at `http://localhost:4000/health`; Postgres is bound to loopback.
4. Use synthetic data only. Do not enter real personal, identity, credential, or financial information.

The API includes example JWT verification and a protected health route, but no account or KYC business workflow. Prisma is a reference schema; migrations have not been generated/applied here. The KYC provider module is an interface only. Before any production implementation, review `../docs/FUTURE-PRODUCTION-ARCHITECTURE.md` with qualified legal/compliance and security professionals.
