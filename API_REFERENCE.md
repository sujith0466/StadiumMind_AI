# API Reference

**StadiumMind AI** provides a modular REST API driven by Flask Blueprints. All endpoints are prefixed with `/api`.

*Note: This platform was built for the PromptWars Virtual Challenge-4.*

---

## 1. Orchestrator & Executive API (`/api/orchestrator`, `/api/executive`)

### `POST /api/orchestrator/resolve`
Accepts a list of conflicting domain AI recommendations and returns a deterministically arbitrated authoritative decision.
- **Request Body:**
  ```json
  {
    "recommendations": [
      {"domain": "TRANSPORT", "action": "Open Gate 4"},
      {"domain": "EMERGENCY", "action": "Close Gate 4 - CODE RED"}
    ]
  }
  ```
- **Response (200 OK):** `{"authoritative_decision": {"domain": "EMERGENCY", ...}}`

### `GET /api/executive/dashboard`
Returns consolidated C-Suite telemetry (attendance, eco-score, platform health).

---

## 2. Emergency & Knowledge API (`/api/emergency`, `/api/knowledge`)

### `POST /api/emergency/incidents`
Escalates a new high-severity emergency.
- **Request Body:** `{"severity": "CRITICAL", "incident_type": "MEDICAL", "zone_id": 2}`

### `POST /api/knowledge/query`
RAG-based Knowledge Assistant.
- **Request Body:** `{"question": "What is the severe weather protocol?"}`
- **Security:** Includes Regex Prompt Injection Guard.
- **Response (200 OK):** `{"ai_answer": "...", "cited_protocol_id": 12, "grounded": true}`

---

## 3. Fan Experience API (`/api/fan`)

### `GET /api/fan/dashboard/<fan_id>`
Backend-For-Frontend (BFF) endpoint aggregating match data, crowd advisories, and transport recommendations into a single payload.

### `POST /api/fan/assistant`
Multilingual Assistant providing grounded venue information.
- **Request Body:** `{"query": "Where is the nearest restroom?", "preferred_language": "es"}`
- **Supported Languages:** `en`, `es`, `fr`, `de`.

---

## 4. Crowd Intelligence API (`/api/crowd`)

### `GET /api/crowd/zones`
Returns all zones with live capacity and mathematically calculated `density_index` (0.0 to 1.0).

### `POST /api/crowd/routes/recommend`
AI heuristic for safe routing around congested zones.

---

## 5. Operations API (`/api/ops`)

### `POST /api/ops/incidents`
Creates an incident and automatically generates an AI resolution recommendation.

## Common Status Codes
- `200 OK` - Request succeeded.
- `201 Created` - Resource created successfully.
- `400 Bad Request` - Missing or invalid parameters.
- `429 Too Many Requests` - Rate limit exceeded (Default: 200/min).
- `500 Internal Server Error` - Unhandled backend exception.
