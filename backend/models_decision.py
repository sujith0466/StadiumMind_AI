from app import db
from datetime import datetime


class AIArbitrationDecision(db.Model):
    __tablename__ = "ai_arbitration_decisions"
    id = db.Column(db.Integer, primary_key=True)
    source_ai_domain = db.Column(db.String(50), nullable=False)
    action_code = db.Column(db.String(50), nullable=False)
    priority_level = db.Column(db.String(20), nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    trigger_event = db.Column(db.String(200), nullable=False)
    execution_status = db.Column(db.String(20), nullable=False, default="PENDING")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
