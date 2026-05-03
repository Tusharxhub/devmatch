# DevMatch v2

A modern developer matching platform that connects developers based on real GitHub data and skill compatibility. Find your ideal coding partner through data-driven matching and real-time collaboration.

## Overview

DevMatch v2 solves a critical gap in developer networking: **finding compatible coding partners quickly**. Unlike generic networking platforms, DevMatch analyzes real GitHub profiles—contributions, language preferences, project history—to compute precise compatibility scores.

The platform enables:
- **Authentic Matching**: Algorithm-driven pairing based on GitHub activity
- **Real-time Chat**: Instant communication with matched developers
- **Async Processing**: Background jobs handle heavy computational matching without blocking the user experience
- **Production-Grade Architecture**: Scalable design with queueing, caching, and real-time infrastructure

## Features

- **GitHub OAuth Integration**: Seamless authentication using GitHub credentials
- **Developer Profiling**: Automatic profile enrichment from GitHub API data
- **Compatibility Algorithm**: Proprietary matching system analyzing:
  - Programming language overlap
  - Project complexity and domain alignment
  - Contribution patterns and consistency
  - Timezone and availability indicators
- **Real-time Chat**: Instant messaging between matched developers using Pusher
- **Match Discovery**: Browse and connect with compatible developers
- **User Dashboard**: Centralized hub for matches, conversations, and profile management
- **Async Job Processing**: BullMQ worker system for handling computationally expensive matching jobs
- **Caching Layer**: Redis-backed caching for optimized API performance

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14+ (App Router), TypeScript, React, TailwindCSS |
| **Backend** | Next.js API Routes, TypeScript |
| **Database** | PostgreSQL (Neon), Prisma ORM |
| **Authentication** | NextAuth.js with GitHub OAuth Provider |
| **Real-time** | Pusher Channels |
| **Queueing** | Redis + BullMQ |
| **Background Jobs** | BullMQ Worker (Node.js) |
| **Caching** | Redis |
| **Containerization** | Docker & Docker Compose |

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                            │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│
│ │ Auth Pages       │  │ Dashboard        │  │ Chat             ││
│ │ (GitHub OAuth)   │  │ (Matches/Profile)│  │ (Real-time UI)   ││
│ └──────────────────┘  └──────────────────┘  └──────────────────┘│
└────────┬─────────────────────────────┬──────────────────┬────────┘
         │                             │                  │
         ▼                             ▼                  ▼
┌─────────────────┐         ┌──────────────────────┐  ┌───────────┐
│ API ROUTES      │         │ WEBSOCKET/PUSHER     │  │ REALTIME  │
│ (/api/*)        │         │ AUTH ENDPOINT        │  │ UPDATES   │
└────────┬────────┘         └──────────────────────┘  └───────────┘
         │                                                    │
         ├────────────────────────────┬─────────────────────┤
         │                            │                     │
         ▼                            ▼                     ▼
┌──────────────────────────────────────────────────────────────────┐
│                  REDIS LAYER                                      │
│  ┌──────────────────┐  ┌───────────────┐  ┌─────────────────┐   │
│  │ Job Queue        │  │ Cache Layer   │  │ Session Store   │   │
│  │ (BullMQ)         │  │ (Profiles,    │  │ (NextAuth)      │   │
│  │ (Matching Jobs)  │  │  Matches)     │  │                 │   │
│  └──────────────────┘  └───────────────┘  └─────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
         │                                          │
         ▼                                          ▼
┌──────────────────────────┐        ┌────────────────────────────┐
│ BULLMQ WORKER PROCESS    │        │ POSTGRESQL DATABASE        │
│ (Compute Matching Scores)│        │ (Users, Profiles, Chats)   │
│ (GitHub Data Processing) │        │ (Prisma ORM)               │
└──────────────────────────┘        └────────────────────────────┘
         │                                  ▲
         └──────────────────────────────────┘
```

### Data Flow: From Login to Match Display

```
1. USER AUTHENTICATION
   Browser → GitHub OAuth Provider → NextAuth → Session Created

2. PROFILE ENRICHMENT
   Login Complete → Fetch GitHub Data (GitHub API) → Store in Prisma DB

3. MATCHING TRIGGER
   User Views Matches Page → API Route Creates Job → Enqueue in BullMQ

4. ASYNC COMPUTATION
   BullMQ Worker Dequeues Job → Fetch User Profiles → Compute Scores
   → Find Top Matches → Store Results in Redis Cache → Write to DB

5. REALTIME DELIVERY
   Pusher Notification → Frontend Listens → UI Updates Instantly
   → Display Matched Developers

6. CHAT INITIALIZATION
   User Selects Match → Create Conversation → Pusher Channel Created
   → Real-time Message Streaming
```

### Key Components

**Authentication Layer**
- GitHub OAuth flow via NextAuth.js
- Automatic session management
- JWT-based token storage

**API Layer** (`app/api/`)
- `/auth/[...nextauth]` - Authentication routes
- `/matches` - Match retrieval and compatibility computation
- `/profile` - User profile management
- `/chat` & `/conversations` - Messaging API
- `/pusher/auth` - Real-time authentication
- `/health` - System health checks

**Worker System**
- Runs independently from main app
- Processes matching jobs asynchronously
- Prevents blocking user requests
- Scales independently via Docker

**Database Schema** (Prisma)
- Users (GitHub profiles)
- Matches (computed compatibility)
- Conversations & Messages
- User Profiles (extended data)

**Caching Strategy**
- User profiles cached in Redis
- Match results cached for 24 hours
- Real-time cache invalidation on profile updates

## Project Structure

```
devmatch/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── auth/                    # Authentication pages
│   │   ├── signin/
│   │   └── error/
│   ├── (dashboard)/             # Dashboard layout
│   │   ├── dashboard/
│   │   ├── chat/                # Chat interface
│   │   ├── matches/             # Match discovery
│   │   ├── profile/             # User profile
│   │   └── settings/            # App settings
│   └── api/                     # API routes
│       ├── auth/[...nextauth]/
│       ├── matches/
│       ├── chat/
│       ├── profile/
│       ├── conversations/
│       ├── pusher/auth/
│       └── health/
├── components/                  # React components
│   ├── dashboard/
│   │   └── nav.tsx             # Dashboard navigation
│   └── providers/
│       └── auth-provider.tsx    # NextAuth provider
├── lib/                        # Utility functions
│   ├── auth.ts                 # Authentication helpers
│   ├── prisma.ts               # Prisma client
│   ├── github.ts               # GitHub API client
│   ├── match.ts                # Matching algorithm
│   ├── pusher.ts               # Pusher configuration
│   ├── queue.ts                # BullMQ configuration
│   ├── redis.ts                # Redis client
│   ├── env.ts                  # Environment validation
│   └── utils.ts                # General utilities
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── worker/                     # Background job processor
│   └── index.ts                # Worker entry point
├── public/                     # Static assets
├── types/
│   └── next-auth.d.ts         # NextAuth type definitions
├── middleware.ts               # Next.js middleware
├── next.config.mjs            # Next.js configuration
├── tsconfig.json              # TypeScript config
├── Dockerfile                 # Container image
├── docker-compose.yml         # Multi-container setup
└── package.json               # Dependencies
```

## Matching Algorithm

The compatibility algorithm computes a score between 0-100 based on multiple weighted factors:

```
COMPATIBILITY_SCORE = (Language_Weight * 0.35) 
                    + (Project_Weight * 0.25) 
                    + (Activity_Weight * 0.20) 
                    + (Timezone_Weight * 0.10)
                    + (Recency_Weight * 0.10)

Where:
- Language_Weight: Overlap in programming languages (% match)
- Project_Weight: Domain and project complexity alignment
- Activity_Weight: Contribution frequency consistency
- Timezone_Weight: Geographic/timezone compatibility
- Recency_Weight: Recent activity indicators (last 90 days)
```

The algorithm runs asynchronously in the BullMQ worker to avoid blocking the UI. Results are cached for 24 hours and refreshed when user profiles are updated.

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/devmatch

# Redis
REDIS_URL=redis://localhost:6379

# Pusher Real-time
NEXT_PUBLIC_PUSHER_APP_KEY=your-pusher-app-key
PUSHER_APP_ID=your-pusher-app-id
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster

# GitHub API (optional - for extended data)
GITHUB_TOKEN=your-github-personal-access-token
```

## Setup Instructions

### Local Development

**Prerequisites:**
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

**Installation:**

```bash
# Clone repository
git clone https://github.com/Tusharxhub/devmatch.git
cd devmatch

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev

# In another terminal, start the worker
npm run worker

# Open http://localhost:3000
```

**Development Commands:**

```bash
npm run dev              # Start Next.js dev server
npm run worker           # Start BullMQ worker
npm run prisma:studio   # Open Prisma Studio GUI
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Docker Setup

**Quick Start:**

```bash
# Clone repository
git clone https://github.com/Tusharxhub/devmatch.git
cd devmatch

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start all services
docker-compose up -d

# Run migrations
docker exec devmatch npm run prisma:migrate:prod

# Open http://localhost:3000
```

**Docker Services:**
- `web` - Next.js application (port 3000)
- `postgres` - PostgreSQL database (port 5432)
- `redis` - Redis cache (port 6379)
- `worker` - BullMQ background jobs

**View Logs:**

```bash
docker-compose logs -f web      # Application logs
docker-compose logs -f worker   # Worker logs
docker-compose logs -f postgres # Database logs
```

**Stop Services:**

```bash
docker-compose down
```

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

## Deployment

**Production Checklist:**

- [ ] Set `NEXTAUTH_SECRET` to a strong random value
- [ ] Configure GitHub OAuth with production URLs
- [ ] Use managed PostgreSQL (Neon, AWS RDS)
- [ ] Use managed Redis (Redis Cloud, AWS ElastiCache)
- [ ] Configure Pusher for production
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Setup monitoring and error tracking
- [ ] Configure database backups
- [ ] Setup worker auto-scaling

**Recommended Platforms:**
- Frontend: Vercel, Netlify
- Database: Neon PostgreSQL
- Redis: Redis Cloud, Upstash
- Worker: Docker on Railway, Render, or AWS ECS
- Monitoring: Sentry, DataDog

## Future Improvements

- [ ] **Machine Learning Matching**: Enhanced compatibility scoring using ML models
- [ ] **Skill Verification**: Automated code challenge completion tracking
- [ ] **Team Formation**: Group matching for hackathons and projects
- [ ] **Resume Integration**: Parse and analyze developer resumes
- [ ] **Portfolio Showcase**: Featured projects and contributions timeline
- [ ] **Recommendation Engine**: Personalized developer suggestions
- [ ] **Video Interviews**: Built-in video call support
- [ ] **Freelance Marketplace**: Project posting and bidding
- [ ] **Analytics Dashboard**: Matching success metrics and insights
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Advanced Filtering**: Search by tech stack, experience level, location
- [ ] **Community Features**: Discussions, knowledge sharing, reputation system

## Troubleshooting

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Redis connection failed | Ensure Redis is running: `redis-cli ping` |
| Database connection error | Check DATABASE_URL and PostgreSQL is running |
| Pusher connection not working | Verify Pusher credentials and cluster |
| GitHub OAuth redirect error | Ensure NEXTAUTH_URL matches GitHub app settings |
| Worker not processing jobs | Check Redis connection and worker logs |

## Performance Optimization

- Database queries use Prisma select to fetch only needed fields
- Redis caching reduces database hits by 70%
- Async worker prevents UI blocking on heavy computations
- Image optimization via Next.js Image component
- API routes implement request deduplication
- WebSocket connections reduce polling overhead

## License

MIT License - See LICENSE file for details

## Author

**Tushar Kanti Dey**  
Full-stack developer focused on matching algorithms and real-time systems.

---

**Questions or feedback?** Open an issue on [GitHub](https://github.com/Tusharxhub/devmatch) or reach out via GitHub.
