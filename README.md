# 📘 RecipeForge
A full-stack digital recipe management system built with a professional monorepo architecture.

## 🚀 Tech Stack
### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- Prisma ORM (v7)
- PostgreSQL
- MinIO (S3-compatible object storage)

### Infrastructure
- Docker Compose
- pnpm workspace monorepo

---

# 📂 Project Structure
```Code
recipeforge/
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # NestJS backend
├── packages/
│   └── shared/     # (future) shared types & utilities
├── infra/
│   └── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```
---

# 🛠 Prerequisites

You must have installed:
- Node 20+
- pnpm
- Docker
- Git
Verify:
```Bash
node -v
pnpm -v
docker --version
```

---

# ⚙️ Setup Instructions
## Install dependencies
From repo root:
```Bash
pnpm install
```

---

## Start infrastructure
```Bash
docker compose -f infra/docker-compose.yml up -d
```
Verify container:
```Bash
docker ps
```
### Services
- Postgres → ```localhost:5432```
- MinIO API → ```localhost:9000```
- MinIO Console → ```http://localhost:9001```

---

## Setup Backend Environment
inside ``` apps/api/.env ```
```Code
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/recipeforge
PORT=3001
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=recipeforge
S3_REGION=us-east-1
```

---

## Run Prisma Migrations
```Bash
cd apps/api
pnpm prisma migrate dev
```

---

## Start Backend
```Bash
pnpm dev
```
API runs at:
```Code
http://localhost:8000
```
Health Check:
```Code
http://localhost:8000/health
```

---

## Setup Frontend Environment
Inside ``` apps/web/.env.local ```:
```Code
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Start Frontend

```Bash
cd apps/web
pnpm dev
```
Fronend runs at:
```Code
http://localhost:3000
```
Recipes page:
```Code
http://localhost:3000/recipes
```

---

## Development Workflow

### Start both Frontend and Backend
From the root directory:
```Bash
pnpm dev
```

### Start individually (Alternative)
Terminal 1 (Backend):
```Bash
cd apps/api
pnpm dev
```
Terminal 2 (Frontend):
```Bash 
cd apps/web
pnpm dev
```
