"""
StadiumMind AI — Emergency Intelligence API (upgraded)
Uses Unified AI Gateway for Knowledge Assistant queries.
"""

from flask import Blueprint, jsonify, request
from models_emergency import db, EmergencyIncident
from services.ai_gateway import query_ai, sanitize

emergency_bp = Blueprint("emergency", __name__, url_prefix="/api/emergency")
knowledge_bp = Blueprint("knowledge", __name__, url_prefix="/api/knowledge")

SEVERITY_LEVELS = ["MINOR", "MODERATE", "SERIOUS", "CRITICAL", "CATASTROPHIC"]

PROTOCOL_DATABASE = {
    "weather": {
        "answer": "Activate Weather Protocol W-1. Move all fans to the lower concourse. Close upper-tier gates.",
        "category": "WEATHER",
        "id": 12,
    },
    "medical": {
        "answer": "Call Code Blue on radio channel 3. Dispatch nearest medical volunteer. Clear 3m radius.",
        "category": "MEDICAL",
        "id": 7,
    },
    "fire": {
        "answer": "Activate Protocol F-1. Begin full evacuation via designated exits. Do not use elevators.",
        "category": "FIRE",
        "id": 3,
    },
    "lost child": {
        "answer": "Escort to Family Assistance Point at Gate 1. Broadcast via PA immediately.",
        "category": "LOST_CHILD",
        "id": 21,
    },
    "security": {
        "answer": "Activate Protocol S-2. Contact venue security on radio channel 1.",
        "category": "SECURITY",
        "id": 8,
    },
    "crowd": {
        "answer": "Activate Protocol C-1. Open relief gates and request Crowd AI re-routing.",
        "category": "CROWD_MANAGEMENT",
        "id": 14,
    },
    "wheelchair": {
        "answer": "Contact volunteer with blue vest or call extension 4400.",
        "category": "ACCESSIBILITY",
        "id": 19,
    },
    "evacuation": {
        "answer": "Proceed calmly to the nearest lit exit following green-lit evacuation routes.",
        "category": "EVACUATION",
        "id": 1,
    },
}


@emergency_bp.route("/incidents", methods=["GET"])
def get_incidents():
    incidents = EmergencyIncident.query.all()
    return (
        jsonify(
            [
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
        ),
        200,
    )


@emergency_bp.route("/incidents", methods=["POST"])
def escalate_incident():
    data = request.get_json() or {}
    severity = data.get("severity", "MINOR")
    if severity not in SEVERITY_LEVELS:
        return jsonify({"error": f"severity must be one of {SEVERITY_LEVELS}"}), 400
    new_incident = EmergencyIncident(
        severity=severity,
        incident_type=data.get("incident_type", "SECURITY"),
        zone_id=data.get("zone_id", 1),
    )
    db.session.add(new_incident)
    db.session.commit()
    return (
        jsonify({"id": new_incident.id, "message": "Incident escalated", "severity": severity}),
        201,
    )


@emergency_bp.route("/evacuations", methods=["POST"])
def trigger_evacuation():
    data = request.get_json() or {}
    zone_id = data.get("zone_id", None)
    return (
        jsonify(
            {
                "message": "Evacuation triggered",
                "zone_id": zone_id,
                "status": "ACTIVE",
                "evacuation_routes": [1, 2, 5],
            }
        ),
        201,
    )


@knowledge_bp.route("/query", methods=["POST"])
def query_knowledge_base():
    """
    Knowledge Assistant via Unified AI Gateway.
    Falls back through: OpenRouter → Gemini → Local Protocol DB
    """
    data = request.get_json() or {}
    raw_question = data.get("question", "")
    language = data.get("language", "en")
    clean_question = sanitize(raw_question)

    if not clean_question:
        return jsonify({"error": "Question is required"}), 400

    # Try AI Gateway first (OpenRouter → Gemini → Local)
    ai_result = query_ai(
        prompt=f"You are a stadium emergency assistant. Answer concisely: {clean_question}",
        context="emergency",
        language=language,
    )

    # Also do local keyword lookup for citation
    protocol = None
    question_lower = clean_question.lower()
    for keyword, p in PROTOCOL_DATABASE.items():
        if keyword in question_lower:
            protocol = p
            break

    return (
        jsonify(
            {
                "question": clean_question,
                "ai_answer": ai_result["response"],
                "category": protocol["category"] if protocol else "GENERAL",
                "cited_protocol_id": protocol["id"] if protocol else None,
                "grounded": ai_result["grounded"],
                "provider": ai_result["provider"],
                "latency_ms": ai_result["latency_ms"],
            }
        ),
        200,
    )


@knowledge_bp.route("/protocols", methods=["GET"])
def list_protocols():
    return (
        jsonify(
            [
                {"category": p["category"], "id": p["id"], "summary": p["answer"][:80]}
                for p in PROTOCOL_DATABASE.values()
            ]
        ),
        200,
    )
