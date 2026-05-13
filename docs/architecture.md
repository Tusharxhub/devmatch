# DevMatch Architecture

DevMatch is implemented as a production-oriented Next.js App Router platform with Prisma-backed data access, NextAuth authentication, BullMQ workers, Redis caching, and Pusher-powered realtime messaging.

## Runtime Surfaces

- **Frontend:** App Router pages under `app/`, reusable UI in `components/`, Tailwind design tokens in `app/globals.css`.
- **API:** Route handlers under `app/api/**` for profiles, matching, projects, project tasks, communities, feed, search, messaging, notifications, and admin operations.
- **Data:** PostgreSQL via Prisma models for users, GitHub profiles, match scores, projects, tasks, communities, posts, messages, notifications, reports, and audit logs.
- **Worker:** `worker/index.ts` processes GitHub sync, match recomputation, and notification jobs with BullMQ.
- **Realtime:** Pusher private channels carry chat events and user notifications. Message persistence always happens before realtime delivery.

## Core Flows

1. User signs in with GitHub or Google through NextAuth.
2. GitHub sign-in stores the provider profile and enqueues a GitHub sync job.
3. The worker enriches the profile, extracts skills, and computes match scores.
4. `/api/matches` reads persisted match scores and can compute deterministic scores on demand for fresh users.
5. Users create projects, manage Kanban tasks, post updates, join communities, and message collaborators.
6. Admin routes enforce role checks, expose platform metrics, manage users, resolve reports, and record audit events.

## Security Controls

- Session-gated dashboard, messages, and admin routes.
- Server-side admin role checks for all admin layouts and APIs.
- Zod validation for write endpoints.
- Security headers in `next.config.mjs`.
- Banned users are blocked from sign-in and excluded from match discovery.
- Admin user actions, report updates, and project task creation write audit logs.

## Scaling Notes

- Move GitHub sync and match recomputation load to independent worker replicas.
- Keep Redis configured with `noeviction` for BullMQ safety.
- Add read replicas or query caching for high-volume search and feed reads.
- Use the existing `MatchScore` table as the recommendation materialization layer.
- Replace Pusher with Socket.IO plus Redis adapter if the deployment requires self-hosted realtime.
