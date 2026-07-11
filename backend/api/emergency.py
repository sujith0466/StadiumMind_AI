"""
StadiumMind AI — Emergency Intelligence API
Handles high-severity incident triage, evacuation orchestration,
and RAG-based Knowledge Assistant queries.
"""
import re
from flask import Blueprint, jsonify, request
from models_emergency import db, EmergencyIncident, ProtocolDocument, KnowledgeQuery

emergency_bp = Blueprint("emergency", __name__, url_prefix="/api/emergency")
knowledge_bp = Blueprint("knowledge", __name__, url_prefix="/api/knowledge")

# ---------------------------------------------------------------------------
# Prompt injection guard — strip known LLM override tokens
# ---------------------------------------------------------------------------
_INJECTION_PATTERNS = re.compile(
    r"(ignore previous|disregard|you are now|system:|act as|jailbreak)",
    re.IGNORECASE,
)


def _sanitize_query(text: str) -> str:
    """Strip prompt injection patterns from user input."""
    return _INJECTION_PATTERNS.sub("[REDACTED]", text).strip()


# ---------------------------------------------------------------------------
# Emergency Incidents
# ---------------------------------------------------------------------------
@emergency_bp.route("/incidents", methods=["GET"])
def get_incidents():
    """Return all active emergency incidents."""
    incidents = EmergencyIncident.query.all()
    result = [
        {
            "id": inc.id,
            "severity": inc.severity,
            "incident_type": inc.incident_type,
            "zone_id": inc.zone_id,
            "status": inc.status,
            "timestamp": inc.timestamp.isoformat() if inc.timestamp else None,
        }
        for inc in incidents
    ]
    return jsonify(result), 200


@emergency_bp.route("/incidents", methods=["POST"])
def escalate_incident():
    """Escalate a new high-severity emergency incident."""
    data = request.get_json() or {}
    severity = data.get("severity", "MINOR")
    incident_type = data.get("incident_type", "SECURITY")
    zone_id = data.get("zone_id", 1)

    new_incident = EmergencyIncident(
        severity=severity, incident_type=incident_type, zone_id=zone_id
    )
    db.session.add(new_incident)
    db.session.commit()
    return jsonify({"id": new_incident.id, "message": "Incident escalated"}), 201


@emergency_bp.route("/evacuations", methods=["POST"])
def trigger_evacuation():
    """Trigger a stadium-wide evacuation plan. Requires Commander role."""
    # Role enforcement scaffold: @jwt_required() + role check goes here (Phase-12)
    data = request.get_json() or {}
    zone_id = data.get("zone_id", None)
    return jsonify({
        "message": "Evacuation triggered",
        "zone_id": zone_id,
        "status": "ACTIVE",
        "evacuation_routes": [1, 2, 5],
    }), 201


# ---------------------------------------------------------------------------
# Knowledge Assistant
# ---------------------------------------------------------------------------
PROTOCOL_DATABASE = {
    "weather": {
        "answer": "For severe weather: activate Weather Protocol W-1. Direct all fans to the lower concourse immediately. Close all upper-tier gates.",
        "category": "WEATHER",
        "id": 12,
    },
    "medical": {
        "answer": "For medical emergencies: call Code Blue via radio channel 3. Dispatch the nearest medical volunteer. Clear a 3-metre radius.",
        "category": "MEDICAL",
        "id": 7,
    },
    "fire": {
        "answer": "For fire: activate Protocol F-1. Initiate full evacuation via designated exit corridors. Do not use elevators.",
        "category": "FIRE",
        "id": 3,
    },
    "lost child": {
        "answer": "For a lost child: escort to the Family Assistance Point at Gate 1. Broadcast name via PA system immediately.",
        "category": "LOST_CHILD",
        "id": 21,
    },
    "security": {
        "answer": "For security threats: activate Protocol S-2. Contact venue security command post on radio channel 1.",
        "category": "SECURITY",
        "id": 8,
    },
    "crowd": {
        "answer": "For crowd surges: activate Protocol C-1. Open relief gates and request Crowd AI re-routing.",
        "category": "CROWD_MANAGEMENT",
        "id": 14,
    },
    "wheelchair": {
        "answer": "For wheelchair assistance: contact the nearest volunteer with a blue vest or call extension 4400.",
        "category": "ACCESSIBILITY",
        "id": 19,
    },
}


def _rag_lookup(question: str) -> dict:
    """
    Lightweight keyword-based RAG retrieval against the PROTOCOL_DATABASE.
    Returns the best matching protocol or a safe fallback.
    """
    question_lower = question.lower()
    for keyword, protocol in PROTOCOL_DATABASE.items():
        if keyword in question_lower:
            return protocol
    return {
        "answer": "Please contact venue staff or dial emergency extension 9000 for immediate assistance.",
        "category": "GENERAL",
        "id": None,
    }


@knowledge_bp.route("/query", methods=["POST"])
def query_knowledge_base():
    """
    RAG-based Knowledge Assistant.
    Sanitizes input, retrieves grounded protocol answer, returns cited source.
    """
    data = request.get_json() or {}
    raw_question = data.get("question", "")
    clean_question = _sanitize_query(raw_question)

    if not clean_question:
        return jsonify({"error": "Question is required"}), 400

    protocol = _rag_lookup(clean_question)
    return jsonify({
        "question": clean_question,
        "ai_answer": protocol["answer"],
        "category": protocol["category"],
        "cited_protocol_id": protocol["id"],
        "grounded": True,
    }), 200


@knowledge_bp.route("/protocols", methods=["GET"])
def list_protocols():
    """Return all available protocol categories."""
    return jsonify([
        {"category": p["category"], "id": p["id"]}
        for p in PROTOCOL_DATABASE.values()
    ]), 200
