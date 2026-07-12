# Deployment Guide

**StadiumMind AI** is production-ready for the **PromptWars Virtual Challenge-4**. The platform uses Docker Compose for full-stack local evaluation, and includes configurations for Vercel and Render cloud deployments.

---

## 1. Docker Compose (Full Stack)

This is the recommended method for PromptWars judges to evaluate the platform locally. It spins up PostgreSQL, Redis, the Flask Backend API, and the Vite/React Frontend behind an Nginx proxy.

### Prerequisites
- Docker & Docker Compose

### Commands
```bash
# Clone the repository
git clone https://github.com/sujith0466/StadiumMind_AI.git
cd StadiumMind_AI

# Build and start all containers in detached mode
docker-compose up --build -d
```

### Accessing the Platform
- **Frontend Dashboards:** [http://localhost:3000](http://localhost:3000)
- **Backend API Gateway:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

To view logs:
```bash
docker-compose logs -f
```

---

## 2. Cloud Deployment (Render & Vercel)

The repository contains pre-configured manifest files for zero-configuration cloud deployments.

### Backend (Render)
Render is used to host the Python Flask API, PostgreSQL, and Redis instances.
1. Connect your Render account to your GitHub repository.
2. Render will automatically detect the `render.yaml` file at the repository root.
3. It will provision `stadiummind-backend`, `stadiummind-db`, and `stadiummind-redis`.
4. Environment variables like `DATABASE_URL` and `REDIS_URL` are auto-injected.

### Frontend (Vercel)
Vercel is used to host the React/Vite SPA.
1. Import the repository into Vercel.
2. Vercel will automatically detect the `vercel.json` file.
3. Configure the `VITE_API_BASE_URL` environment variable to point to your Render backend URL (e.g., `https://stadiummind-backend.onrender.com`).
4. The `vercel.json` rewrite rules ensure SPA routes and `/api/*` proxies function correctly.

---

## 3. Local Development (Without Docker)

### Backend
Requires Python 3.11+.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start the Flask development server (runs on port 5000)
python app.py
```

### Frontend
Requires Node.js 18+.
```bash
cd frontend
npm ci
npm run dev
# Vite dev server runs on port 5173 by default
```

## Troubleshooting
- **Database Errors on Startup:** Ensure `db.create_all()` fired correctly on app startup, or run migrations if added later.
- **CORS Issues:** If running frontend and backend on different local ports without Docker/Nginx, ensure `CORS_ORIGINS` in your `.env` includes your frontend URL.
