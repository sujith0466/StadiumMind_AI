# StadiumMind AI — Enterprise Smart Stadium Operations & Crowd Intelligence Platform

StadiumMind AI is an autonomous, multi-agent enterprise platform designed to revolutionize venue operations, real-time crowd safety, volunteer dispatch, accessibility routing, transport sustainability, and emergency management.

## Platform Architecture

StadiumMind AI is built on a clean, modular architecture combining Python Flask Blueprints, SQLAlchemy relational models, strict TypeScript/Zod shared contracts, and a responsive React 18 + Vite + Tailwind CSS frontend.

### Core Intelligence Modules
1. **Foundation Layer (Phase-4):** Shared database engine, Zod/TypeScript schemas, and modular architecture.
2. **Operations Intelligence (Phase-5):** Real-time venue incident triage and automated resolution recommendations.
3. **Crowd Intelligence (Phase-6):** Real-time spatial density prediction, heatmap visualization, and ADA safe-route wayfinding.
4. **Volunteer & Accessibility Intelligence (Phase-7):** AI volunteer task dispatch and wheelchair-accessible barrier-free navigation.
5. **Transport & Sustainability Intelligence (Phase-8):** Smart parking, EV shuttle routing, energy consumption metrics, and automated eco-dimming.
6. **Emergency Intelligence & Knowledge Assistant (Phase-9):** CODE RED escalation matrix, automated evacuation routes, First Responder tracking, and RAG-based protocol assistant.
7. **Fan Experience Portal & Multilingual Assistant (Phase-10):** Responsive BFF portal with offline cache bundles, 9-step fan journey mapping, and natural language multilingual AI assistant.
8. **Unified AI Orchestration & Executive Dashboard (Phase-11):** Central deterministic AI Conflict Resolver (`EMERGENCY > CROWD > OPERATIONS > TRANSPORT > FAN`), decision audit logs, notification deduplication, and C-Suite Executive Command interface.
9. **Production Hardening (Phase-12):** Security middleware, RBAC enforcement, performance optimization, and containerized deployment readiness.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Containerized Deployment (Production)
```bash
docker-compose up --build -d
```
This launches:
- **Backend API Gateway & Orchestrator:** `http://localhost:5000`
- **Frontend Portal & Dashboards:** `http://localhost:3000`

### Local Development
1. **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python run.py
   ```
2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## License
MIT License. See [LICENSE](LICENSE) for details.
