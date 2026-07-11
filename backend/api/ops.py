"""
StadiumMind AI — Operations Intelligence API
Provides CRUD for stadium incidents, recommendations,
and the operations overview dashboard.
"""
from flask import Blueprint, jsonify, request
from models import db, Incident, StadiumZone, Recommendation, TimelineEntry, Alert
from services.ai_engine import generate_recommendation

ops_bp = Blueprint("ops", __name__, url_prefix="/api/ops")


@ops_bp.route("/incidents", methods=["GET"])
def get_incidents():
    """Return all operational incidents with zone and status context."""
    incidents = Incident.query.all()
    return jsonify([
        {
            "id": inc.id,
            "severity": inc.severity,
            "status": inc.status,
            "zone_id": inc.zone_id,
            "created_at": inc.created_at.isoformat() if inc.created_at else None,
        }
        for inc in incidents
    ]), 200


@ops_bp.route("/incidents", methods=["POST"])
def create_incident():
    """Create and triage a new operational incident with AI recommendation."""
    data = request.get_json() or {}
    new_inc = Incident(
        severity=data.get("severity", "LOW"),
        status="OPEN",
        zone_id=data.get("zone_id", 1),
    )
    db.session.add(new_inc)
    db.session.flush()  # get ID before commit

    # Generate AI recommendation
    ai_rec = generate_recommendation({"incident_id": new_inc.id, "severity": new_inc.severity})
    rec = Recommendation(
        incident_id=new_inc.id,
        ai_confidence=ai_rec["ai_confidence"],
        proposed_action=ai_rec["proposed_action"],
        approved=False,
    )
    db.session.add(rec)
    db.session.commit()

    return jsonify({
        "id": new_inc.id,
        "message": "Incident created",
        "ai_recommendation": ai_rec["proposed_action"],
        "confidence": ai_rec["ai_confidence"],
    }), 201


@ops_bp.route("/incidents/<int:incident_id>", methods=["PATCH"])
def update_incident_status(incident_id):
    """Update the status of an existing incident (e.g. OPEN → RESOLVED)."""
    inc = Incident.query.get_or_404(incident_id)
    data = request.get_json() or {}
    if "status" in data:
        inc.status = data["status"]
        db.session.commit()
    return jsonify({"id": inc.id, "status": inc.status}), 200


@ops_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """Return operational KPIs for the operations overview dashboard."""
    total = Incident.query.count()
    open_count = Incident.query.filter_by(status="OPEN").count()
    resolved = Incident.query.filter_by(status="RESOLVED").count()
    return jsonify({
        "total_incidents": total,
        "open_incidents": open_count,
        "resolved_incidents": resolved,
        "active_zones": StadiumZone.query.count(),
    }), 200
