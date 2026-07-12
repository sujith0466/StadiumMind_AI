from app import db
from datetime import datetime


class CrowdZone(db.Model):
    __tablename__ = "crowd_zones"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    max_capacity = db.Column(db.Integer, nullable=False)
    geo_polygon = db.Column(db.JSON, nullable=True)  # GeoJSON representation
    snapshots = db.relationship("CrowdSnapshot", backref="zone", lazy=True)
    queues = db.relationship("Queue", backref="zone", lazy=True)
    alerts = db.relationship("DensityAlert", backref="zone", lazy=True)


class CrowdSnapshot(db.Model):
    __tablename__ = "crowd_snapshots"
    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    occupancy = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    prediction = db.relationship("CrowdPrediction", backref="snapshot", uselist=False)


class CrowdPrediction(db.Model):
    __tablename__ = "crowd_predictions"
    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    snapshot_id = db.Column(db.Integer, db.ForeignKey("crowd_snapshots.id"), nullable=True)
    predicted_occupancy = db.Column(db.Integer, nullable=False)
    timeframe_mins = db.Column(db.Integer, nullable=False)


class Queue(db.Model):
    __tablename__ = "queues"
    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    estimated_wait_time = db.Column(db.Integer, nullable=False)  # In minutes
    person_count = db.Column(db.Integer, nullable=False)


class EntryGate(db.Model):
    __tablename__ = "entry_gates"
    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    throughput_per_minute = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default="OPEN")


class ExitGate(db.Model):
    __tablename__ = "exit_gates"
    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    throughput_per_minute = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default="OPEN")


class DensityAlert(db.Model):
    __tablename__ = "density_alerts"
    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    severity = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class SafeRoute(db.Model):
    __tablename__ = "safe_routes"
    id = db.Column(db.Integer, primary_key=True)
    start_zone = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    end_zone = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    waypoints = db.Column(db.JSON, nullable=False)  # List of zones
    is_active = db.Column(db.Boolean, default=True)


class EvacuationRoute(db.Model):
    __tablename__ = "evacuation_routes"
    id = db.Column(db.Integer, primary_key=True)
    start_zone = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    end_zone = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    waypoints = db.Column(db.JSON, nullable=False)
    is_active = db.Column(db.Boolean, default=False)


class CrowdEvent(db.Model):
    __tablename__ = "crowd_events"
    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)


class MovementPattern(db.Model):
    __tablename__ = "movement_patterns"
    id = db.Column(db.Integer, primary_key=True)
    origin_zone_id = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    destination_zone_id = db.Column(db.Integer, db.ForeignKey("crowd_zones.id"), nullable=False)
    volume = db.Column(db.Integer, nullable=False)


class OccupancyStatistics(db.Model):
    __tablename__ = "occupancy_statistics"
    id = db.Column(db.Integer, primary_key=True)
    total_stadium_occupancy = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
