"""
StadiumMind AI — Unified AI Orchestrator & Executive API
Central conflict resolver and C-Suite oversight endpoints.
"""
from flask import Blueprint, jsonify, request
from services.orchestrator_ai import resolve_ai_conflicts

orchestrator_bp = Blueprint("orchestrator", __name__, url_prefix="/api/orchestrator")
executive_bp = Blueprint("executive", __name__, url_prefix="/api/executive")


@orchestrator_bp.route("/decisions", methods=["GET"])
def get_decisions():
    """Return the current authoritative AI decision log."""
    return jsonify([
        {
            "id": 1,
            "source_ai_domain": "Emergency AI",
            "action_code": "EVACUATE_ZONE_4",
            "priority_level": "EMERGENCY",
            "status": "EXECUTED",
            "target_zone_id": 4,
            "confidence_score": 0.99,
            "supporting_ai_domains": ["Crowd AI", "Transport AI"],
            "human_approval_required": True,
            "trigger_event": "CODE RED — Medical Alert in Sector 4",
            "execution_status": "EXECUTED",
            "timestamp": "2026-07-11T10:00:00Z",
        }
    ]), 200


@orchestrator_bp.route("/resolve", methods=["POST"])
def resolve():
    """
    Accepts a list of domain AI recommendations and returns the authoritative decision.
    Example body: [{"domain": "EMERGENCY", "action": "..."}, ...]
    """
    data = request.get_json() or {}
    recommendations = data.get("recommendations", [])
    if not isinstance(recommendations, list):
        return jsonify({"error": "recommendations must be a list"}), 400
    result = resolve_ai_conflicts(recommendations)
    return jsonify(result), 200


@executive_bp.route("/dashboard", methods=["GET"])
def get_executive_dashboard():
    """Return consolidated C-Suite KPI and platform health telemetry."""
    return jsonify({
        "platform_status": "HEALTHY",
        "active_incidents": 1,
        "total_attendance": 64500,
        "eco_score_percentage": 88.5,
        "volunteer_utilization": 0.85,
        "crowd_density_index": 0.72,
        "open_accessibility_requests": 3,
        "active_shuttle_routes": 4,
        "services_health": [
            {"service_name": "Operations AI", "status": "HEALTHY"},
            {"service_name": "Crowd AI", "status": "HEALTHY"},
            {"service_name": "Volunteer AI", "status": "HEALTHY"},
            {"service_name": "Transport AI", "status": "HEALTHY"},
            {"service_name": "Emergency AI", "status": "HEALTHY"},
            {"service_name": "Fan Experience Portal", "status": "HEALTHY"},
            {"service_name": "Knowledge Assistant", "status": "HEALTHY"},
            {"service_name": "AI Orchestrator", "status": "HEALTHY"},
        ],
    }), 200


@executive_bp.route("/health", methods=["GET"])
def platform_health():
    """Lightweight platform health-check for monitoring integrations."""
    return jsonify({"status": "ok", "services": 8, "incidents": 1}), 200
