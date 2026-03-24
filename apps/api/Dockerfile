FROM node:22-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.30.2 --activate
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma and Build API
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN pnpm --filter api run prisma:generate
RUN pnpm --filter api run build

# Remove development dependencies to save space (optional, but let's keep it simple first)
# RUN pnpm install --prod --frozen-lockfile --ignore-scripts

EXPOSE 3000
WORKDIR /app/apps/api
CMD ["node", "dist/src/main"]
