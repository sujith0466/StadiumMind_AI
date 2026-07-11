from app import db
from datetime import datetime

class StadiumZone(db.Model):
    __tablename__ = 'stadium_zones'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_occupancy = db.Column(db.Integer, default=0)
    incidents = db.relationship('Incident', backref='zone', lazy=True)
    alerts = db.relationship('Alert', backref='zone', lazy=True)

class Incident(db.Model):
    __tablename__ = 'incidents'
    id = db.Column(db.Integer, primary_key=True)
    severity = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='OPEN')
    zone_id = db.Column(db.Integer, db.ForeignKey('stadium_zones.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    recommendation = db.relationship('Recommendation', backref='incident', uselist=False, lazy=True)
    timeline_entries = db.relationship('TimelineEntry', backref='incident', lazy=True)
    assignments = db.relationship('UserAssignment', backref='incident', lazy=True)

class Recommendation(db.Model):
    __tablename__ = 'recommendations'
    id = db.Column(db.Integer, primary_key=True)
    incident_id = db.Column(db.Integer, db.ForeignKey('incidents.id'), nullable=False)
    ai_confidence = db.Column(db.Float, nullable=False)
    proposed_action = db.Column(db.Text, nullable=False)
    approved = db.Column(db.Boolean, default=False)

class OperationEvent(db.Model):
    __tablename__ = 'operation_events'
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(50), nullable=False)
    payload = db.Column(db.JSON, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Alert(db.Model):
    __tablename__ = 'alerts'
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    zone_id = db.Column(db.Integer, db.ForeignKey('stadium_zones.id'), nullable=False)

class UserAssignment(db.Model):
    __tablename__ = 'user_assignments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False) # Simplified, no User model yet
    incident_id = db.Column(db.Integer, db.ForeignKey('incidents.id'), nullable=False)
    role = db.Column(db.String(50), nullable=False)

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    read = db.Column(db.Boolean, default=False)

class TimelineEntry(db.Model):
    __tablename__ = 'timeline_entries'
    id = db.Column(db.Integer, primary_key=True)
    incident_id = db.Column(db.Integer, db.ForeignKey('incidents.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
