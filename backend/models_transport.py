from app import db
from datetime import datetime

class ParkingZone(db.Model):
    __tablename__ = 'parking_zones'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    max_capacity = db.Column(db.Integer, nullable=False)
    current_occupancy = db.Column(db.Integer, default=0)
    zone_type = db.Column(db.String(50), nullable=False) # e.g. VIP, PUBLIC, ADA
    ev_stations = db.relationship('EVStation', backref='parking_zone', lazy=True)

class EVStation(db.Model):
    __tablename__ = 'ev_stations'
    id = db.Column(db.Integer, primary_key=True)
    parking_zone_id = db.Column(db.Integer, db.ForeignKey('parking_zones.id'), nullable=False)
    status = db.Column(db.String(20), default='AVAILABLE')
    power_output_kw = db.Column(db.Float, nullable=False)

class ShuttleRoute(db.Model):
    __tablename__ = 'shuttle_routes'
    id = db.Column(db.Integer, primary_key=True)
    route_name = db.Column(db.String(100), nullable=False)
    active_vehicles = db.Column(db.Integer, default=0)
    estimated_wait_time = db.Column(db.Integer, default=0)
    stops = db.Column(db.JSON, nullable=False)
    accessibility_equipped = db.Column(db.Boolean, default=True)

class TransportAlert(db.Model):
    __tablename__ = 'transport_alerts'
    id = db.Column(db.Integer, primary_key=True)
    severity = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class FanTransportRecommendation(db.Model):
    __tablename__ = 'fan_transport_recommendations'
    id = db.Column(db.Integer, primary_key=True)
    fan_id = db.Column(db.Integer, nullable=True) # Placeholder for Fan User ID
    parking_recommendation = db.Column(db.String(100), nullable=True)
    best_entrance = db.Column(db.String(100), nullable=True)
    shuttle_recommendation = db.Column(db.String(100), nullable=True)
    walking_route_estimation_mins = db.Column(db.Integer, nullable=True)
    accessibility_aware = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class EnergyMetric(db.Model):
    __tablename__ = 'energy_metrics'
    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, nullable=False) # Cross-phase reference
    kw_usage = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class WasteBin(db.Model):
    __tablename__ = 'waste_bins'
    id = db.Column(db.Integer, primary_key=True)
    location_zone_id = db.Column(db.Integer, nullable=False)
    fill_percentage = db.Column(db.Float, default=0.0)
    needs_clearance = db.Column(db.Boolean, default=False)

class SustainabilityMetric(db.Model):
    __tablename__ = 'sustainability_metrics'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Expanded Sustainability KPIs
    total_carbon_offset_kg = db.Column(db.Float, nullable=False, default=0.0)
    renewable_energy_percentage = db.Column(db.Float, nullable=False, default=0.0)
    water_usage_liters = db.Column(db.Float, nullable=False, default=0.0)
    recycling_rate_percentage = db.Column(db.Float, nullable=False, default=0.0)
    waste_diversion_percentage = db.Column(db.Float, nullable=False, default=0.0)
    energy_cost_savings_usd = db.Column(db.Float, nullable=False, default=0.0)
