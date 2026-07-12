from flask import Blueprint, jsonify
from models_volunteer import Volunteer, VolunteerTask
from flask_jwt_extended import jwt_required

volunteer_bp = Blueprint("volunteers", __name__, url_prefix="/api/volunteers")
accessibility_bp = Blueprint("accessibility", __name__, url_prefix="/api/accessibility")


@volunteer_bp.route("/", methods=["GET"])
def get_volunteers():
    volunteers = Volunteer.query.all()
    result = []
    for v in volunteers:
        result.append(
            {
                "id": v.id,
                "name": v.name,
                "active": v.active,
                "languages": v.languages,
                "medical_training": v.medical_training,
                "mobility_assistance": v.mobility_assistance,
                "sign_language": v.sign_language,
                "child_assistance": v.child_assistance,
                "security_clearance": v.security_clearance,
                "zone_certifications": v.zone_certifications,
            }
        )
    return jsonify(result), 200


@volunteer_bp.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = VolunteerTask.query.all()
    result = []
    for t in tasks:
        result.append(
            {
                "id": t.id,
                "description": t.description,
                "status": t.status,
                "priority": t.priority,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "response_duration": t.response_duration,
            }
        )
    return jsonify(result), 200


@accessibility_bp.route("/requests", methods=["POST"])
@jwt_required()
def create_accessibility_request():
    # Submit an accessibility request
    return jsonify({"message": "Request logged"}), 201


@accessibility_bp.route("/analytics", methods=["GET"])
def get_accessibility_analytics():
    # Fetch KPIs
    return (
        jsonify(
            {
                "avg_response_time": 120.5,
                "request_categories": {"medical": 10, "mobility": 5},
                "volunteer_utilization": 0.85,
                "translation_success_rate": 0.95,
                "route_success_rate": 0.99,
            }
        ),
        200,
    )
