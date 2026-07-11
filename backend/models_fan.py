from app import db
from datetime import datetime

class FanProfile(db.Model):
    __tablename__ = 'fan_profiles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    preferred_language = db.Column(db.String(20), default='en')
    accessibility_required = db.Column(db.Boolean, default=False)
    favorite_team = db.Column(db.String(100), nullable=True)

class VenuePOI(db.Model):
    __tablename__ = 'venue_pois'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False) # FOOD, RESTROOM, MEDICAL, MERCH, ENTRANCE
    zone_id = db.Column(db.Integer, nullable=False) # Cross-phase reference
    accessibility_equipped = db.Column(db.Boolean, default=True)

class FanJourneyStep(db.Model):
    __tablename__ = 'fan_journey_steps'
    id = db.Column(db.Integer, primary_key=True)
    step_name = db.Column(db.String(50), nullable=False) # ARRIVAL, PARKING, ENTRY, SEAT, FOOD, RESTROOM, MATCH, EXIT, TRANSPORT_HOME
    mapped_intelligence_module = db.Column(db.String(100), nullable=False) # e.g., Transport Intelligence, Crowd Intelligence
    description = db.Column(db.Text, nullable=False)

class FanOfflineCacheBundle(db.Model):
    __tablename__ = 'fan_offline_cache_bundles'
    id = db.Column(db.Integer, primary_key=True)
    fan_id = db.Column(db.Integer, db.ForeignKey('fan_profiles.id'), nullable=False)
    cached_venue_map_url = db.Column(db.String(255), nullable=True)
    cached_emergency_instructions = db.Column(db.Text, nullable=True)
    cached_ticket_info = db.Column(db.JSON, nullable=True)
    cached_favorite_routes = db.Column(db.JSON, nullable=True)
    last_synced = db.Column(db.DateTime, default=datetime.utcnow)

class TranslationSession(db.Model):
    __tablename__ = 'translation_sessions'
    id = db.Column(db.Integer, primary_key=True)
    fan_id = db.Column(db.Integer, nullable=True)
    source_lang = db.Column(db.String(10), nullable=False)
    target_lang = db.Column(db.String(10), nullable=False)
    query_text = db.Column(db.Text, nullable=False)
    translated_response = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
