# Security Policy & Vulnerability Disclosure

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Architecture

StadiumMind AI enforces enterprise-grade security across all modular intelligence domains:
- **Role-Based Access Control (RBAC):** Strict JWT verification and role decorators (`Commander`, `Executive`, `Volunteer`, `Fan`).
- **Defensive Middleware:** API Rate Limiting, Cross-Origin Resource Sharing (CORS) hardening, and Input Sanitization.
- **AI Safety & RAG Grounding:** Knowledge Assistant responses are strictly grounded against verified protocol templates to prevent prompt injection and policy hallucinations.

## Reporting a Vulnerability

If you discover a potential security vulnerability within StadiumMind AI, please report it immediately to the DevSecOps Lead via private email. Do not open public GitHub issues for sensitive security matters. All reports will be triaged within 24 hours under our Catastrophic/Critical SLA.
