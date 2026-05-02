# ═══════════════════════════════════════════════════════════════════════════════
# DevMatch v2 — Multi-stage Dockerfile
# ═══════════════════════════════════════════════════════════════════════════════

# ─── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy only dependency files first (cache layer optimization)
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --ignore-scripts
# Generate Prisma Client
RUN npx prisma generate

# ─── Stage 2: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source code (after deps for cache efficiency)
COPY . .

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
RUN npm run build

# ─── Stage 3: Runner (Production) ─────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl curl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application (minimal footprint)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set proper permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3333

ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3333/api/health || exit 1

CMD ["node", "server.js"]

# ─── Stage: Worker ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS worker
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy only worker-relevant source files
COPY lib ./lib
COPY worker ./worker
COPY tsconfig.json ./

# Install tsx for running TypeScript directly
RUN npx tsx --version || true

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker
USER worker

CMD ["npx", "tsx", "worker/index.ts"]
