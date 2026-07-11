from flask import Blueprint, jsonify, request
from models_orchestrator import db, UnifiedDecision, PlatformHealth

orchestrator_bp = Blueprint('orchestrator', __name__, url_prefix='/api/orchestrator')
executive_bp = Blueprint('executive', __name__, url_prefix='/api/executive')

@orchestrator_bp.route('/decisions', methods=['GET'])
def get_decisions():
    return jsonify([
        {
            "id": 1,
            "source_ai_domain": "Emergency AI",
            "action_code": "EVACUATE_ZONE_4",
            "priority_level": "EMERGENCY",
            "status": "APPROVED",
            "target_zone_id": 4,
            "confidence_score": 0.99,
            "supporting_ai_domains": ["Crowd AI", "Transport AI"],
            "human_approval_required": True,
            "trigger_event": "CODE RED - Medical Alert in Sector 4",
            "execution_status": "EXECUTED",
            "timestamp": "2026-07-11T10:00:00Z"
        }
    ]), 200

@executive_bp.route('/dashboard', methods=['GET'])
def get_executive_dashboard():
    return jsonify({
        "platform_status": "HEALTHY",
        "active_incidents": 1,
        "total_attendance": 64500,
        "eco_score_percentage": 88.5,
        "volunteer_utilization": 0.85,
        "services_health": [
            {"service_name": "Operations AI", "status": "HEALTHY"},
            {"service_name": "Crowd AI", "status": "HEALTHY"},
            {"service_name": "Volunteer AI", "status": "HEALTHY"},
            {"service_name": "Transport AI", "status": "HEALTHY"},
            {"service_name": "Emergency AI", "status": "HEALTHY"},
            {"service_name": "Fan Experience Portal", "status": "HEALTHY"}
        ]
    }), 200
