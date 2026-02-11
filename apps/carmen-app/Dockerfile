FROM oven/bun:1.3.2 AS base

# Install dependencies only
FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb turbo.json ./
COPY apps/carmen-app/package.json ./apps/carmen-app/
COPY packages/ ./packages/
RUN bun install

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_EXCHANGE_RATE_API_KEY
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_X_APP_ID
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_FRONTEND_URL

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=$NEXT_PUBLIC_EXCHANGE_RATE_API_KEY
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_X_APP_ID=$NEXT_PUBLIC_X_APP_ID
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL

RUN bun run build --filter=carmen-app

# Production runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/carmen-app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/carmen-app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/carmen-app/.next/static ./apps/carmen-app/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/carmen-app/server.js"]
