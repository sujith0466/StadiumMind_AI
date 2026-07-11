from flask import Blueprint, jsonify, request
from models_crowd import db, CrowdZone, CrowdSnapshot, Queue, SafeRoute, DensityAlert

crowd_bp = Blueprint('crowd', __name__, url_prefix='/api/crowd')

@crowd_bp.route('/zones', methods=['GET'])
def get_zones():
    zones = CrowdZone.query.all()
    result = [{"id": z.id, "name": z.name, "max_capacity": z.max_capacity} for z in zones]
    return jsonify(result), 200

@crowd_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    # Aggregates KPI and high-level stadium state
    total_occupancy = sum([s.occupancy for s in CrowdSnapshot.query.limit(10).all()]) # Simplified
    return jsonify({"total_stadium_occupancy": total_occupancy}), 200

@crowd_bp.route('/predictions', methods=['GET'])
def get_predictions():
    # Fetch AI forecasts
    return jsonify([]), 200

@crowd_bp.route('/routes', methods=['GET'])
def get_safe_routes():
    # Fetch SafeRoute paths
    routes = SafeRoute.query.filter_by(is_active=True).all()
    result = [{"id": r.id, "start_zone": r.start_zone, "end_zone": r.end_zone, "waypoints": r.waypoints} for r in routes]
    return jsonify(result), 200

@crowd_bp.route('/simulation', methods=['POST'])
def trigger_simulation():
    # Endpoints to trigger fake surges
    return jsonify({"message": "Crowd surge simulated"}), 200
