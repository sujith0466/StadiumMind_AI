from flask import Blueprint, jsonify
from models_transport import db, ParkingZone, FanTransportRecommendation

transport_bp = Blueprint('transport', __name__, url_prefix='/api/transport')
sustainability_bp = Blueprint('sustainability', __name__, url_prefix='/api/sustainability')

@transport_bp.route('/parking', methods=['GET'])
def get_parking():
    parking = ParkingZone.query.all()
    result = []
    for p in parking:
        result.append({
            "id": p.id,
            "name": p.name,
            "max_capacity": p.max_capacity,
            "current_occupancy": p.current_occupancy,
            "zone_type": p.zone_type
        })
    return jsonify(result), 200

@transport_bp.route('/recommendations/fan/<int:fan_id>', methods=['GET'])
def get_fan_recommendation(fan_id):
    # Retrieve Fan Transport Recommendations
    return jsonify({
        "fan_id": fan_id,
        "parking_recommendation": "Lot B",
        "best_entrance": "Gate 4",
        "shuttle_recommendation": "Blue Line",
        "walking_route_estimation_mins": 12,
        "accessibility_aware": True
    }), 200

@sustainability_bp.route('/metrics', methods=['GET'])
def get_sustainability_metrics():
    # Returns the Expanded Sustainability KPIs
    return jsonify({
        "total_carbon_offset_kg": 15400.5,
        "renewable_energy_percentage": 45.2,
        "water_usage_liters": 120500.0,
        "recycling_rate_percentage": 78.5,
        "waste_diversion_percentage": 82.0,
        "energy_cost_savings_usd": 4200.75
    }), 200
