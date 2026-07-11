from flask import Blueprint, jsonify, request
from models import db, Incident, StadiumZone, Recommendation, TimelineEntry, Alert

ops_bp = Blueprint('ops', __name__, url_prefix='/api/ops')

@ops_bp.route('/incidents', methods=['GET'])
def get_incidents():
    incidents = Incident.query.all()
    result = []
    for inc in incidents:
        result.append({
            "id": inc.id,
            "severity": inc.severity,
            "status": inc.status,
            "zone_id": inc.zone_id,
            "created_at": inc.created_at.isoformat() if inc.created_at else None
        })
    return jsonify(result), 200

@ops_bp.route('/incidents', methods=['POST'])
def create_incident():
    data = request.json
    new_inc = Incident(
        severity=data.get('severity', 'LOW'),
        status='OPEN',
        zone_id=data.get('zone_id', 1)
    )
    db.session.add(new_inc)
    db.session.commit()
    return jsonify({"id": new_inc.id, "message": "Incident created"}), 201

@ops_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    total_incidents = Incident.query.count()
    return jsonify({"total_incidents": total_incidents}), 200
