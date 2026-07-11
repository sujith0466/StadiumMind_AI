# System Architecture

**StadiumMind AI** employs a modular, domain-driven Backend-For-Frontend (BFF) architecture. The platform was designed to scale across the complex, high-concurrency environments typical of Smart Stadiums and Tournament Operations (PromptWars Challenge-4).

---

## 🏗️ High-Level Architecture

```text
+-------------------------------------------------------------+
|                     User Interfaces                         |
|  [Fan Portal]   [Emergency Command]  [Executive Dashboard]  |
|  (React 18, Vite, Tailwind CSS, React Router v6)            |
+------------------------------+------------------------------+
                               |
                        HTTPS (REST JSON)
                               |
+------------------------------v------------------------------+
|                    Backend API Gateway                      |
|                  (Python, Flask, Gunicorn)                  |
|                                                             |
|  +-------------+ +-------------+ +-----------------------+  |
|  | /api/fan    | | /api/crowd  | | /api/orchestrator     |  |
|  | /api/ops    | | /api/emerg  | | /api/executive        |  |
|  | /api/trans  | | /api/vol    | | /api/knowledge        |  |
|  +-------------+ +-------------+ +-----------------------+  |
+------------------------------+------------------------------+
                               |
+------------------------------v------------------------------+
|                 Unified AI Orchestrator                     |
|  (Deterministic Conflict Resolver & Priority Mediation)     |
+------------------------------+------------------------------+
                               |
+------------------+-----------+-----------+------------------+
|                  |                       |                  |
v                  v                       v                  v
[PostgreSQL]    [Redis]              [LLM AI APIs]      [External]
(Relational)    (Cache & PubSub)     (Gemini/OpenAI)    (Ticketing)
```

## 🧩 Core Components

### 1. Frontend Layer
- **Framework:** React 18 with Vite for ultra-fast HMR and optimized production bundles.
- **Styling:** Tailwind CSS, prioritizing high-contrast themes (WCAG 2.1 AA) and rapid utility classes.
- **Routing:** React Router v6 mapping to domain-specific dashboards.
- **State/Data:** Axios for API consumption.

### 2. Backend Layer
- **Framework:** Python Flask (v3.0.0).
- **Modularity:** 11 distinct Flask Blueprints logically separating domains (e.g., `ops_bp`, `crowd_bp`, `fan_bp`).
- **Security:** Flask-Limiter for rate limiting, Flask-CORS for cross-origin management, and `X-Content-Type-Options` security headers applied globally.

### 3. Shared Contracts
- **TypeScript Zod:** Located in `/shared`, providing strict type definitions that exactly mirror the backend SQLAlchemy schemas.

### 4. Database Layer
- **PostgreSQL:** Relational data storage via SQLAlchemy ORM. Domains are intentionally decoupled; cross-domain references use soft integer IDs (e.g., `zone_id`) rather than strict foreign keys where boundary isolation is required.
- **Redis:** Handles high-throughput pub/sub for crowd density simulators and application-level caching.

---

## 🔒 Security Architecture

1. **Role-Based Access Control (RBAC):** Prepared via Flask-JWT-Extended.
2. **Defensive Middleware:** Rate limits (200/min default) prevent abuse.
3. **Prompt Injection Protection:** Regex sanitizers strip malicious LLM override tokens before AI processing.
4. **ORM Protection:** 100% SQLAlchemy parameterization prevents SQL injection.

---

## 🌐 Deployment Architecture

The system is containerized for seamless production rollout:

1. **Backend Container:** Python 3.11-slim running Flask.
2. **Frontend Container:** Multi-stage build compiling Vite to static assets, served via Nginx (Alpine).
3. **Nginx Proxy:** Handles SPA fallback routing and reverse-proxies `/api/` to the backend container.
4. **Cloud Compatibility:** Pre-configured for Render (`render.yaml`) and Vercel (`vercel.json`).

*Built for PromptWars Virtual Challenge-4.*
