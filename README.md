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
- Postgress → ```localhost:5432```
- MinIO API → ```localhost:9000```
- MinIO Console → ```http://localhost:9001```
Login to MinIO console:
```Code
username: minioadmin
password: minioadmin123
```

---

## Setup Backend Environment
inside ``` assp/api/.env ```
```Code
PORT=8000
DATABASE_URL=postgresql://recipeforge:recipeforge@localhost:5432/recipeforge?schema=public
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_BUCKET=recipe-images
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
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
pnpm run start:dev
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
NEXT_PUBLIC_API-URL=http://localhost:8000
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
### Run everything 
Terminal 1:
```Bash
cd apps/api
pnpm run start:dev
```
Terminal 2:
```Bash 
cd apps/web
pnpm dev
```
