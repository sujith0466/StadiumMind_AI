# Changelog

All notable changes to the **StadiumMind AI** platform—built for the PromptWars Virtual Challenge-4—will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-11

### 🚀 Added
- **Unified AI Orchestrator**: Deterministic conflict resolution for competing domain AI recommendations (`EMERGENCY > CROWD > OPERATIONS > TRANSPORT > FAN`).
- **Emergency Knowledge Assistant**: Keyword-based RAG pipeline returning grounded stadium protocols with cited IDs.
- **Multilingual Fan Assistant**: AI support translating 8 grounded knowledge topics into 4 languages (EN, ES, FR, DE).
- **Crowd Intelligence API**: Spatial density index calculation and AI-powered safe routing.
- **Executive Command Dashboard**: C-Suite telemetry aggregating active incidents, total attendance, and eco-score percentages.
- **Docker Compose Stack**: Full 4-service deployment (PostgreSQL, Redis, Backend, Frontend).
- **Security Hardening**: Prompt Injection regex guards, Flask-Limiter, CORS scoping, and Security Headers.
- **Test Suite**: 40-case Pytest suite covering AI determinism, health checks, and 7 domain APIs.
- **Cloud Configurations**: Pre-configured `vercel.json` and `render.yaml` for zero-friction cloud deployment.

### 🛡️ Security
- Prompt injection protection applied to both `fan.py` and `emergency.py` LLM input endpoints.
- ORM queries strictly parameterized via SQLAlchemy to prevent SQL Injection.
- Environment variables template (`.env.example`) enforces secret isolation.

### 📝 Documentation
- Published `README.md`, `SYSTEM_ARCHITECTURE.md`, `AI_PIPELINE.md`, `API_REFERENCE.md`, `DEPLOYMENT_GUIDE.md`, and `ENVIRONMENT.md`.
