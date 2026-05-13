# Deployment Guide

## Required Environment

```bash
DATABASE_URL=
REDIS_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
NEXT_PUBLIC_APP_URL=
```

Google OAuth and Pusher are optional at build time, but required for those production features.

## Local Docker

```bash
docker compose up --build
```

The app listens on `http://localhost:3001`, PostgreSQL on `5432`, Redis on `6379`, and the worker starts as a separate service.

## Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Use Prisma migrations instead of `db:push` once the schema is deployed to shared environments.

## CI/CD

`.github/workflows/ci.yml` installs dependencies, generates Prisma Client, runs TypeScript, and builds the Next.js app. Production deployment should run the same checks before promotion.

## Suggested Production Split

- **Frontend:** Vercel project using `npm run build`.
- **Worker:** Railway/Render service running `DEVMATCH_SERVICE=worker npm run worker`.
- **Database:** Neon PostgreSQL.
- **Redis:** Upstash, Railway Redis, or a managed Redis configured with `maxmemory-policy noeviction`.
- **Monitoring:** Add Sentry DSN and PostHog keys through environment variables.
