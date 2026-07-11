# StadiumMind AI

![PromptWars Challenge-4 Badge](https://img.shields.io/badge/PromptWars%20Virtual%20Challenge--4-Smart%20Stadiums%20&%20Tournament%20Operations-blue?style=for-the-badge)

**An autonomous, multi-agent enterprise platform revolutionizing venue operations, crowd safety, and fan experience.**

---

## 🏟️ Project Overview

**StadiumMind AI** was engineered specifically for the **PromptWars Virtual Challenge-4: Smart Stadiums & Tournament Operations**.

The modern mega-stadium is a complex, hyper-dynamic ecosystem. Managing 80,000+ fans, coordinating hundreds of volunteers, ensuring ADA accessibility, minimizing carbon footprint, and responding to medical or security emergencies requires split-second, coordinated intelligence. 

StadiumMind AI solves this by deploying a distributed network of specialized AI agents — coordinated by a central Unified AI Orchestrator — to predict crowd surges, dispatch volunteers, translate fan queries, and execute life-saving evacuation routes in real time.

---

## 🎯 PromptWars Challenge Alignment

Every feature of StadiumMind AI maps directly to the core themes of the PromptWars Virtual Challenge-4:

| Challenge Requirement | StadiumMind AI Solution |
|-----------------------|-------------------------|
| **Smart Stadiums** | Unified orchestration of Operations, Crowd, and Transport domains |
| **Tournament Operations** | Volunteer dispatch, task triaging, and real-time dashboard oversight |
| **Fan Experience** | 9-step mapped Fan Journey, BFF dashboard, multilingual RAG assistant |
| **Accessibility** | ADA routing flags, wheelchair-accessible POIs, high-contrast themes |
| **Emergency Safety** | 5-level severity matrix, evacuation overrides, deterministic AI arbitration |
| **Sustainability** | EV shuttle routing, smart parking occupancy, energy/carbon metrics |

---

## 🧠 Key Features & AI Capabilities

- **Unified AI Orchestrator:** A deterministic Conflict Resolver that arbitrates between competing AI suggestions (e.g., *EMERGENCY overrides TRANSPORT*).
- **Emergency Knowledge Assistant:** A keyword-based RAG pipeline providing instant, grounded protocol responses (with cited IDs) to mitigate hallucinations.
- **Crowd Intelligence:** Real-time spatial density prediction and dynamic safe-route wayfinding away from congestion.
- **Multilingual Fan Assistant:** Grounded, localized AI responses supporting English, Spanish, French, and German.
- **C-Suite Executive Command:** High-level telemetry covering platform health, active incidents, attendance, and Eco-Score.

---

## 🏗️ Architecture Overview

StadiumMind AI is an enterprise-grade monorepo employing a modular **Backend-For-Frontend (BFF)** architecture.

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router v6
- **Backend:** Python Flask + 11 Modular Blueprints + SQLAlchemy ORM
- **Database:** PostgreSQL (Relational Data) + Redis (Pub/Sub & Caching)
- **Shared Contracts:** Zod/TypeScript schemas mirroring Python ORM models

For a deep dive, see [System Architecture](SYSTEM_ARCHITECTURE.md) and the [AI Pipeline](AI_PIPELINE.md).

---

## 🚀 Deployment Instructions

The platform is containerized for zero-friction evaluation.

### Option A: Docker Compose (Recommended)
Launch the entire 4-service stack (Database, Redis, Backend API, Frontend SPA).
```bash
docker-compose up --build -d
```
- Frontend Dashboards: `http://localhost:3000`
- Backend API Gateway: `http://localhost:5000`

### Option B: Local Development
Ensure PostgreSQL and Redis are running locally.
```bash
# 1. Backend
cd backend
pip install -r requirements.txt
python app.py

# 2. Frontend
cd frontend
npm ci
npm run dev
```

For Render/Vercel cloud deployment instructions, see the [Deployment Guide](DEPLOYMENT_GUIDE.md).

---

## 🛡️ Security & Testing

- **Security:** Rate limiting, CORS, Security Headers, ORM parameterized queries, and Prompt Injection Guards on all LLM inputs. See [SECURITY.md](SECURITY.md).
- **Testing:** 40-case Pytest suite covering AI determinism, health checks, and all 7 domain APIs.
- **Accessibility:** WCAG 2.1 AA compliant color contrast, ARIA landmarks, and screen-reader optimized navigation.

---

## 📚 Documentation Directory

Explore the complete enterprise documentation suite:
- [System Architecture](SYSTEM_ARCHITECTURE.md)
- [AI Pipeline & Orchestration](AI_PIPELINE.md)
- [API Reference](API_REFERENCE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Project Structure](PROJECT_STRUCTURE.md)
- [Environment Variables](ENVIRONMENT.md)
- [Changelog](CHANGELOG.md)
- [Contributing Guide](CONTRIBUTING.md)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built for the PromptWars Virtual Challenge-4 by the StadiumMind AI Engineering Team.*
