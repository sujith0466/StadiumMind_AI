from app import db
from datetime import datetime

class Volunteer(db.Model):
    __tablename__ = 'volunteers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    active = db.Column(db.Boolean, default=True)
    
    # Expanded Capability Fields
    languages = db.Column(db.JSON, nullable=True) # Array of language codes
    medical_training = db.Column(db.Boolean, default=False)
    mobility_assistance = db.Column(db.Boolean, default=False)
    sign_language = db.Column(db.Boolean, default=False)
    child_assistance = db.Column(db.Boolean, default=False)
    security_clearance = db.Column(db.Boolean, default=False)
    zone_certifications = db.Column(db.JSON, nullable=True) # Array of zone IDs

class VolunteerTask(db.Model):
    __tablename__ = 'volunteer_tasks'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='PENDING') # PENDING, ASSIGNED, RESOLVED
    priority = db.Column(db.String(20), default='NORMAL')
    
    # Logical SLA Tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    assigned_time = db.Column(db.DateTime, nullable=True)
    acknowledged_time = db.Column(db.DateTime, nullable=True)
    resolved_time = db.Column(db.DateTime, nullable=True)
    response_duration = db.Column(db.Integer, nullable=True) # Duration in seconds

class AccessibilityRequest(db.Model):
    __tablename__ = 'accessibility_requests'
    id = db.Column(db.Integer, primary_key=True)
    need_type = db.Column(db.String(50), nullable=False)
    location_zone_id = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='OPEN')
    task_id = db.Column(db.Integer, db.ForeignKey('volunteer_tasks.id'), nullable=True)

class AccessibleRoute(db.Model):
    __tablename__ = 'accessible_routes'
    id = db.Column(db.Integer, primary_key=True)
    start_point = db.Column(db.String(100), nullable=False)
    end_point = db.Column(db.String(100), nullable=False)
    path_data = db.Column(db.JSON, nullable=False) # GeoJSON or waypoints

class HelpRequest(db.Model):
    __tablename__ = 'help_requests'
    id = db.Column(db.Integer, primary_key=True)
    request_type = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='OPEN')
    task_id = db.Column(db.Integer, db.ForeignKey('volunteer_tasks.id'), nullable=True)

class TranslationRequest(db.Model):
    __tablename__ = 'translation_requests'
    id = db.Column(db.Integer, primary_key=True)
    language = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='OPEN')
    task_id = db.Column(db.Integer, db.ForeignKey('volunteer_tasks.id'), nullable=True)

class AccessibilityMetrics(db.Model):
    __tablename__ = 'accessibility_metrics'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    avg_response_time = db.Column(db.Float, nullable=False)
    request_categories = db.Column(db.JSON, nullable=False)
    volunteer_utilization = db.Column(db.Float, nullable=False)
    translation_success_rate = db.Column(db.Float, nullable=False)
    route_success_rate = db.Column(db.Float, nullable=False)
