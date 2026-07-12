from app import db
from datetime import datetime


class UnifiedContext(db.Model):
    __tablename__ = "unified_contexts"
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    version = db.Column(db.String(20), default="v1.0")
    global_stadium_state = db.Column(db.JSON, nullable=False)
    active_emergencies = db.Column(db.Integer, default=0)
    total_crowd = db.Column(db.Integer, default=0)


class UnifiedDecision(db.Model):
    __tablename__ = "unified_decisions"
    id = db.Column(db.Integer, primary_key=True)
    source_ai_domain = db.Column(db.String(50), nullable=False)  # e.g., Emergency AI, Crowd AI
    action_code = db.Column(db.String(100), nullable=False)
    priority_level = db.Column(db.String(20), nullable=False)  # EMERGENCY, HIGH, NORMAL
    status = db.Column(db.String(20), default="PENDING")  # PENDING, APPROVED, EXECUTED, OVERRIDDEN
    target_zone_id = db.Column(db.Integer, nullable=True)

    # Decision Intelligence Enhancements
    confidence_score = db.Column(db.Float, default=0.95)
    supporting_ai_domains = db.Column(db.JSON, nullable=True)  # Array of domain strings
    human_approval_required = db.Column(db.Boolean, default=False)
    expires_at = db.Column(db.DateTime, nullable=True)

    # Decision Audit Trail Enhancements
    trigger_event = db.Column(db.String(200), nullable=True)
    input_context_version = db.Column(db.String(20), default="v1.0")
    ai_modules_consulted = db.Column(db.JSON, nullable=True)
    override_info = db.Column(db.Text, nullable=True)
    execution_status = db.Column(db.String(50), default="PENDING_EXECUTION")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class UnifiedNotificationEvent(db.Model):
    __tablename__ = "unified_notification_events"
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(50), nullable=False)
    severity = db.Column(db.String(20), nullable=False)
    recipient_scope = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)

    # Notification Coordination Enhancements
    deduplication_hash = db.Column(db.String(64), nullable=True, unique=True)
    priority_rank = db.Column(db.Integer, default=100)  # Lower number = higher priority
    consolidated_count = db.Column(db.Integer, default=1)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class PlatformHealth(db.Model):
    __tablename__ = "platform_health"
    id = db.Column(db.Integer, primary_key=True)
    service_name = db.Column(db.String(100), nullable=False, unique=True)
    status = db.Column(db.String(20), default="HEALTHY")
    last_heartbeat = db.Column(db.DateTime, default=datetime.utcnow)
