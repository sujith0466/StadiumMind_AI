# StadiumMind AI — Security Policy

**StadiumMind AI** treats platform security as a critical priority, especially given the life-safety implications of Smart Stadium emergency management (PromptWars Virtual Challenge-4).

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Core Security Architecture

1. **Role-Based Access Control (RBAC):** Prepared via JWT tokens. Commander-level actions (e.g. triggering an evacuation) require strict authorization.
2. **Prompt Injection Defense:** All user inputs sent to the Knowledge Assistant or Fan Assistant pass through regex sanitization guards to strip override tokens before evaluation.
3. **Grounded RAG:** AI endpoints utilize strict Retrieval-Augmented Generation mapped to trusted IDs, preventing hallucination.
4. **Data Protection:** SQLAlchemy ORM strictly parameterizes all database queries.

## Reporting a Vulnerability

If you discover a vulnerability affecting the PromptWars evaluation instance, please report it via GitHub Issues or contact the engineering team directly. We commit to a 24-hour triage SLA.
