# StadiumMind AI — Contributing Guide

Thank you for your interest in contributing to StadiumMind AI, built for the **PromptWars Virtual Challenge-4: Smart Stadiums & Tournament Operations**.

## Development Setup

### Prerequisites
- Python 3.11+, Node.js 18+, Docker, Docker Compose

### Quick Start (Local)
```bash
# Backend
cd backend && pip install -r requirements.txt && python app.py

# Frontend
cd frontend && npm install && npm run dev
```

### Quick Start (Docker)
```bash
docker-compose up --build -d
```

## Branch Strategy
- `main` — stable, production-ready
- Feature branches — `feature/<domain>-<description>`

## Code Standards
- Python: PEP8, enforced by `flake8` (config in `.flake8`)
- TypeScript: ESLint + Prettier (config in `.prettierrc`)
- All new Flask endpoints require docstrings
- All new SQLAlchemy models require Zod mirror in `/shared`

## Testing
```bash
cd backend && pytest
```
All PRs must maintain 100% pass rate on existing test suite.

## Security
- Never commit `.env` files
- All secrets must use environment variables
- Report vulnerabilities per `SECURITY.md`
