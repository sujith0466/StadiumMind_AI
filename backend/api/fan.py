from flask import Blueprint, jsonify, request
from models_fan import db, FanProfile, VenuePOI, FanJourneyStep, FanOfflineCacheBundle

fan_bp = Blueprint('fan', __name__, url_prefix='/api/fan')

@fan_bp.route('/dashboard/<int:fan_id>', methods=['GET'])
def get_fan_dashboard(fan_id):
    """
    BFF Endpoint aggregating cross-phase capabilities:
    - Operations advisories
    - Crowd safe routes
    - Transport recommendations
    - Emergency alert status
    - Fan Journey steps
    """
    return jsonify({
        "fan_id": fan_id,
        "live_match": {
            "title": "Championship Finals",
            "score": "2 - 1",
            "status": "LIVE - 68'"
        },
        "advisories": ["Gate 2 experiencing heavy congestion. Rerouting recommended."],
        "emergency_status": "NORMAL",
        "offline_cache_ready": True
    }), 200

@fan_bp.route('/journey', methods=['GET'])
def get_fan_journey():
    """
    Returns the complete fan journey timeline mapped to platform intelligence modules.
    """
    steps = [
        {"step_name": "ARRIVAL", "mapped_intelligence_module": "Transport Intelligence", "description": "AI traffic guidance & best entrance."},
        {"step_name": "PARKING", "mapped_intelligence_module": "Transport Intelligence", "description": "Real-time smart parking lot occupancy."},
        {"step_name": "ENTRY", "mapped_intelligence_module": "Crowd Intelligence", "description": "Gate queue wait times & throughput."},
        {"step_name": "SEAT", "mapped_intelligence_module": "Crowd Intelligence", "description": "Wayfinding & crowd density heatmap."},
        {"step_name": "FOOD", "mapped_intelligence_module": "Operations Intelligence", "description": "Concession wait times & mobile ordering."},
        {"step_name": "RESTROOM", "mapped_intelligence_module": "Volunteer & Accessibility Intelligence", "description": "ADA-compliant restroom locator."},
        {"step_name": "MATCH", "mapped_intelligence_module": "Fan Experience Portal", "description": "Live match stats & multilingual AI FAQ."},
        {"step_name": "EXIT", "mapped_intelligence_module": "Emergency & Crowd Intelligence", "description": "Safe route & evacuation wayfinding."},
        {"step_name": "TRANSPORT_HOME", "mapped_intelligence_module": "Transport Intelligence", "description": "EV charging & shuttle departure times."}
    ]
    return jsonify(steps), 200

@fan_bp.route('/assistant', methods=['POST'])
def query_multilingual_assistant():
    data = request.json or {}
    query = data.get('query', '')
    lang = data.get('preferred_language', 'en')
    return jsonify({
        "query": query,
        "language": lang,
        "response": f"[{lang.upper()}] Assistant response: For wheelchair accessible seating near Section 104, take Elevator B."
    }), 200
