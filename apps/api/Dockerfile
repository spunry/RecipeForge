# Base stage for dependencies
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --filter api --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app /app
COPY . .
RUN pnpm --filter api run prisma:generate
RUN pnpm --filter api run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat openssl curl

# Create a non-root user for security (optional but recommended)
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nestjs
# USER nestjs

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 8000
WORKDIR /app/apps/api
CMD ["node", "dist/main"]
