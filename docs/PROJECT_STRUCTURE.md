# Project Structure

**StadiumMind AI** follows an enterprise-grade monorepo structure, cleanly separating the backend, frontend, and shared contracts.

---

## 📂 Repository Layout

```text
StadiumMind_AI/
├── backend/                  # Python Flask Backend API
│   ├── api/                  # Blueprint REST Endpoints (Controllers)
│   │   ├── crowd.py          # Crowd Intelligence API
│   │   ├── emergency.py      # Emergency & RAG API
│   │   ├── fan.py            # Fan Experience BFF API
│   │   ├── ops.py            # Operations Intelligence API
│   │   ├── orchestrator.py   # AI Conflict Arbitration API
│   │   ├── transport.py      # Transport & Sustainability API
│   │   └── volunteers.py     # Volunteer & Accessibility API
│   ├── services/             # AI Agents & Business Logic
│   │   ├── ai_engine.py      # Core AI heuristics
│   │   ├── crowd_ai.py       # Density & Routing AI
│   │   ├── emergency_ai.py   # Triage Escalation logic
│   │   ├── fan_ai.py         # Multilingual logic
│   │   ├── orchestrator_ai.py# Priority arbitration engine
│   │   ├── simulator.py      # Background Redis simulators
│   │   └── volunteer_ai.py   # Dispatch matching
│   ├── models*.py            # SQLAlchemy ORM Models
│   ├── app.py                # Flask Application Factory
│   ├── test_health.py        # Comprehensive Pytest Suite
│   ├── Dockerfile            # Backend Container Image
│   └── requirements.txt      # Python Dependencies
│
├── frontend/                 # React SPA (Vite + Tailwind)
│   ├── src/
│   │   ├── features/         # Domain-Specific UI Components
│   │   │   ├── emergency/    # Emergency Command Dashboard
│   │   │   ├── executive/    # C-Suite Executive Command
│   │   │   └── fan/          # Multilingual Fan Portal
│   │   ├── App.tsx           # React Router v6 Configuration
│   │   ├── index.css         # Global Tailwind Directives
│   │   └── main.tsx          # React Entry Point
│   ├── Dockerfile            # Frontend Nginx Container
│   ├── nginx.conf            # Proxy & SPA Fallback rules
│   └── package.json          # Node Dependencies
│
├── shared/                   # Shared Type Contracts
│   └── schemas/              # Zod TypeScript Definitions mirroring ORM
│
├── render.yaml               # Render Cloud Configuration
├── vercel.json               # Vercel SPA Configuration
├── docker-compose.yml        # Local Full-Stack Orchestration
├── README.md                 # Primary Documentation
└── .env.example              # Environment Variables Template
```

---

## 🏛️ Architectural Principles

1. **Domain Isolation:** Each Blueprint in `backend/api/` represents a specific intelligence phase from the PromptWars blueprints. They only interact via the Unified AI Orchestrator or the Database.
2. **Backend-For-Frontend (BFF):** The `fan.py` endpoint acts as an aggregator, preventing the React frontend from needing to query 5 different internal services.
3. **Shared Contracts:** While a monorepo allows sharing TS types with the backend, we use Zod schemas in `/shared/schemas` as the source of truth for frontend type safety, directly mapped to the Flask ORM structures.
