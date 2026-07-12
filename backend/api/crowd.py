"""
StadiumMind AI — Crowd Intelligence API
Exposes crowd zone telemetry, safe routes, density predictions,
and crowd surge simulation endpoints.
"""

from flask import Blueprint, jsonify, request
from models_crowd import CrowdZone, CrowdSnapshot, SafeRoute, DensityAlert
from services.crowd_ai import calculate_density, generate_safe_route
from cache_utils import cache_response
from flask_jwt_extended import jwt_required

crowd_bp = Blueprint("crowd", __name__, url_prefix="/api/crowd")


@crowd_bp.route("/zones", methods=["GET"])
@cache_response(ttl_seconds=15)
def get_zones():
    """Return all crowd zones with live density index."""
    zones = CrowdZone.query.all()
    result = []
    for z in zones:
        latest = (
            CrowdSnapshot.query.filter_by(zone_id=z.id)
            .order_by(CrowdSnapshot.timestamp.desc())
            .first()
        )
        occupancy = latest.occupancy if latest else 0
        result.append(
            {
                "id": z.id,
                "name": z.name,
                "max_capacity": z.max_capacity,
                "current_occupancy": occupancy,
                "density_index": round(calculate_density(occupancy, z.max_capacity), 2),
            }
        )
    return jsonify(result), 200


@crowd_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """Return aggregated crowd intelligence KPIs."""
    total_occupancy = sum(s.occupancy for s in CrowdSnapshot.query.limit(10).all())
    alert_count = DensityAlert.query.filter_by(severity="HIGH").count()
    return (
        jsonify(
            {
                "total_stadium_occupancy": total_occupancy,
                "high_density_alerts": alert_count,
                "active_safe_routes": SafeRoute.query.filter_by(is_active=True).count(),
            }
        ),
        200,
    )


@crowd_bp.route("/routes", methods=["GET"])
def get_safe_routes():
    """Return all active crowd safe routes."""
    routes = SafeRoute.query.filter_by(is_active=True).all()
    return (
        jsonify(
            [
                {
                    "id": r.id,
                    "start_zone": r.start_zone,
                    "end_zone": r.end_zone,
                    "waypoints": r.waypoints,
                }
                for r in routes
            ]
        ),
        200,
    )


@crowd_bp.route("/routes/recommend", methods=["POST"])
def recommend_route():
    """
    AI-powered safe route recommendation.
    Body: {"start_zone": int, "end_zone": int, "congested_zones": [int]}
    """
    data = request.get_json() or {}
    start = data.get("start_zone", 1)
    end = data.get("end_zone", 5)
    congested = data.get("congested_zones", [])
    route = generate_safe_route(start, end, congested)
    return jsonify(route), 200


@crowd_bp.route("/simulation", methods=["POST"])
@jwt_required()
def trigger_simulation():
    """Trigger a crowd surge simulation for testing."""
    return jsonify({"message": "Crowd surge simulated", "affected_zones": [2, 3]}), 200
