from app import db
from datetime import datetime


class EmergencySeverityMatrix(db.Model):
    __tablename__ = "emergency_severity_matrix"
    id = db.Column(db.Integer, primary_key=True)
    level = db.Column(
        db.String(20), nullable=False, unique=True
    )  # ADVISORY, MINOR, MAJOR, CRITICAL, CATASTROPHIC
    response_sla_mins = db.Column(db.Integer, nullable=False)
    required_roles = db.Column(db.JSON, nullable=False)
    notification_scope = db.Column(db.String(50), nullable=False)
    escalation_policy = db.Column(db.Text, nullable=False)


class EmergencyIncident(db.Model):
    __tablename__ = "emergency_incidents"
    id = db.Column(db.Integer, primary_key=True)
    severity = db.Column(
        db.String(20), db.ForeignKey("emergency_severity_matrix.level"), nullable=False
    )
    incident_type = db.Column(db.String(50), nullable=False)  # MEDICAL, SECURITY, WEATHER
    zone_id = db.Column(db.Integer, nullable=False)  # Cross-phase reference
    status = db.Column(db.String(20), default="ACTIVE")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class FirstResponder(db.Model):
    __tablename__ = "first_responders"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    unit_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default="AVAILABLE")
    current_zone_id = db.Column(db.Integer, nullable=True)


class EvacuationPlan(db.Model):
    __tablename__ = "evacuation_plans"
    id = db.Column(db.Integer, primary_key=True)
    emergency_id = db.Column(db.Integer, db.ForeignKey("emergency_incidents.id"), nullable=False)
    active_routes = db.Column(db.JSON, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class ProtocolDocument(db.Model):
    __tablename__ = "protocol_documents"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content_text = db.Column(db.Text, nullable=False)
    category = db.Column(
        db.String(50), nullable=False
    )  # MEDICAL, FIRE, SECURITY, WEATHER, LOST_CHILD, ACCESSIBILITY, TRANSPORT, CROWD_MANAGEMENT
    tags = db.Column(db.JSON, nullable=True)


class KnowledgeQuery(db.Model):
    __tablename__ = "knowledge_queries"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    question = db.Column(db.Text, nullable=False)
    ai_answer = db.Column(db.Text, nullable=False)
    cited_protocol_id = db.Column(db.Integer, db.ForeignKey("protocol_documents.id"), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
