# 📘 RecipeForge
A full-stack digital recipe management system built with a professional monorepo architecture, optimized for home server deployment (like Raspberry Pi).

## 🚀 Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** NestJS, Prisma ORM (v7)
- **Database:** PostgreSQL 16
- **Storage:** MinIO (S3-compatible object storage)
- **Infrastructure:** Docker Compose with automated Prisma migrations and health checks.

---

# 📂 Project Structure
```text
recipeforge/
├── apps/
│   ├── web/        # Next.js frontend (Port 3000)
│   └── api/        # NestJS backend (Port 8000)
├── infra/
│   ├── docker-compose.yml # Full stack orchestration
│   └── .env        # Infrastructure secrets
├── pnpm-workspace.yaml
└── README.md
```

---

# 🍓 Raspberry Pi Deployment Guide

This guide assumes you are using **Raspberry Pi OS (64-bit)** or any Debian-based ARM64 distribution.

### 1. Prerequisites
Install Docker and Git on your Pi:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Logout and login again for group changes to take effect

# Install Git
sudo apt install git -y
```

### 2. Clone the Repository
```bash
git clone https://github.com/your-repo/RecipeForge.git
cd RecipeForge
```

### 3. Configure Environment Variables
You need to set up the infrastructure secrets.

**Create `infra/.env`:**
```bash
cp infra/.env.example infra/.env # If example exists, otherwise create it
```
Edit `infra/.env` and set your passwords:
```ini
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=recipeforge
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=your_secure_minio_password
```

### 4. Configure LAN Access (Critical)
To access the recipe manager from other devices on your WiFi/LAN, you must point the web app to your Raspberry Pi's IP address.

1. **Find your Pi's IP:**
   ```bash
   hostname -I
   # Example output: 192.168.1.15
   ```

2. **Update `apps/web/.env.local`:**
   Change `localhost` to your Pi's actual IP:
   ```ini
   NEXT_PUBLIC_API_URL=http://192.168.1.15:8000
   PORT=3000
   ```

### 5. Deploy the Stack
Run the full automated stack. This will build the images, run database migrations, and start all services:
```bash
# Using the root pnpm script (if pnpm is installed)
pnpm compose:up

# OR using docker compose directly from the root
docker compose -f infra/docker-compose.yml --env-file infra/.env up -d --build
```

### 6. Verify Deployment
Check if all containers are healthy:
```bash
docker compose -f infra/docker-compose.yml ps
```
Wait until the status shows `(healthy)` for `recipeforge-api` and `recipeforge-db`.

---

# 🎮 Accessing the Application
Once running, you can access the services from any device on your network:

- **Frontend:** `http://<your-pi-ip>:3000`
- **Backend API:** `http://<your-pi-ip>:8000`
- **MinIO Console:** `http://<your-pi-ip>:9001` (Login with `MINIO_ROOT_USER` credentials)

---

# 🛠 Common Commands

- `pnpm compose:up`: Build and start the full Dockerized stack.
- `pnpm compose:down`: Stop and remove all containers.
- `docker compose -f infra/docker-compose.yml logs -f`: View real-time logs for all services.
- `npx prisma studio --schema=apps/api/prisma/schema.prisma`: Open a GUI to view/edit your database (requires local pnpm/node).
