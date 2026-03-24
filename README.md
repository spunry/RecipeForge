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
- Docker Compose (Containerized Apps & Services)
- pnpm workspace monorepo

---

# 📂 Project Structure
```text
recipeforge/
├── apps/
│   ├── web/        # Next.js frontend (Dockerized)
│   └── api/        # NestJS backend (Dockerized)
├── infra/
│   ├── docker-compose.yml # Full stack orchestration
│   └── .env        # Infrastructure secrets
├── pnpm-workspace.yaml
└── README.md
```

---

# 🛠 Prerequisites
You must have installed:
- Node 22+ (LTS)
- pnpm
- Docker & Docker Compose
- Git

---

# ⚙️ Setup & Running

## 🐳 Option 1: Full Docker Stack (Recommended)
Run the entire application (DB, MinIO, API, Web) in containers:

1. **Install dependencies (host):**
   ```bash
   pnpm install
   ```

2. **Configure Environment:**
   Ensure `infra/.env` is populated with infrastructure secrets.
   The web app will automatically use `http://localhost:3001` for the API.

3. **Start the stack:**
   ```bash
   pnpm compose:up
   ```

4. **Access the apps:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:3001](http://localhost:3001)
   - **MinIO Console:** [http://localhost:9001](http://localhost:9001)

---

## 💻 Option 2: Local Development Mode
Run infrastructure in Docker, and applications on your host machine:

1. **Start Infrastructure Only:**
   ```bash
   pnpm infra:up
   ```

2. **Initialize Database:**
   ```bash
   # From root
   pnpm --filter api run prisma:generate
   pnpm --filter api run prisma migrate dev
   ```

3. **Start All Apps (Hot Reloading):**
   ```bash
   pnpm dev
   ```
   *Note: In local mode, the API will default to port 8000.*

---

# 📄 Environment Variables

### Infrastructure (`infra/.env`)
Used by Docker Compose for DB and MinIO credentials.
```ini
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=recipeforge
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

### Backend (`apps/api/.env`)
```ini
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/recipeforge
PORT=8000
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=recipeforge
S3_REGION=us-east-1
```

### Frontend (`apps/web/.env.local`)
**Recommendation:** Use `127.0.0.1` instead of `localhost` to avoid IPv6 resolution issues in some browsers.
```ini
# For Docker Stack:
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001

# For Local Development:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

# 🛠 Common Commands

- `pnpm compose:up`: Build and start the full Dockerized stack.
- `pnpm compose:down`: Stop and remove all containers.
- `pnpm infra:up`: Start only infrastructure (DB, MinIO).
- `pnpm dev`: Start all apps in development mode on host.
- `pnpm test`: Run tests (TBD).
