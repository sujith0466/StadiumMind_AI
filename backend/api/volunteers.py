from flask import Blueprint, jsonify, request
from models_volunteer import db, Volunteer, VolunteerTask, AccessibilityMetrics

volunteer_bp = Blueprint('volunteers', __name__, url_prefix='/api/volunteers')
accessibility_bp = Blueprint('accessibility', __name__, url_prefix='/api/accessibility')

@volunteer_bp.route('/', methods=['GET'])
def get_volunteers():
    # Returns the list of volunteers
    return jsonify([]), 200

@volunteer_bp.route('/tasks', methods=['GET'])
def get_tasks():
    # Returns the list of volunteer tasks
    return jsonify([]), 200

@accessibility_bp.route('/requests', methods=['POST'])
def create_accessibility_request():
    # Submit an accessibility request
    return jsonify({"message": "Request logged"}), 201

@accessibility_bp.route('/analytics', methods=['GET'])
def get_accessibility_analytics():
    # Fetch KPIs
    return jsonify({
        "avg_response_time": 120.5,
        "request_categories": {"medical": 10, "mobility": 5},
        "volunteer_utilization": 0.85,
        "translation_success_rate": 0.95,
        "route_success_rate": 0.99
    }), 200
