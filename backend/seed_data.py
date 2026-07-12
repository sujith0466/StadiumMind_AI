import os
from app import create_app
from models import db, StadiumZone, Incident, Recommendation, TimelineEntry, Alert, UserAssignment, OperationEvent
from models_crowd import CrowdZone, CrowdSnapshot, SafeRoute
from models_decision import AIArbitrationDecision
from models_volunteer import Volunteer, AccessibilityRequest
from models_transport import ParkingZone, SustainabilityMetric
from models_emergency import EmergencySeverityMatrix, EmergencyIncident
from datetime import datetime, timedelta
import random

app = create_app()

def seed():
    with app.app_context():
        print("Creating tables...")
        db.create_all()

        print("Clearing existing data...")
        db.session.query(Recommendation).delete()
        db.session.query(EmergencyIncident).delete()
        db.session.query(EmergencySeverityMatrix).delete()
        db.session.query(Incident).delete()
        db.session.query(StadiumZone).delete()
        db.session.query(CrowdSnapshot).delete()
        db.session.query(CrowdZone).delete()
        db.session.query(Volunteer).delete()
        db.session.query(ParkingZone).delete()
        db.session.query(SustainabilityMetric).delete()
        db.session.query(AIArbitrationDecision).delete()
        
        print("Seeding Emergency Severity Matrix...")
        sev_levels = [
            EmergencySeverityMatrix(level="ADVISORY", response_sla_mins=30, required_roles=["STEWARD"], notification_scope="LOCAL", escalation_policy="LOG_ONLY"),
            EmergencySeverityMatrix(level="LOW", response_sla_mins=25, required_roles=["STEWARD"], notification_scope="LOCAL", escalation_policy="LOG_ONLY"),
            EmergencySeverityMatrix(level="MINOR", response_sla_mins=20, required_roles=["STEWARD", "SECURITY"], notification_scope="ZONE", escalation_policy="SUPERVISOR"),
            EmergencySeverityMatrix(level="MEDIUM", response_sla_mins=15, required_roles=["SECURITY", "MEDICAL"], notification_scope="ZONE", escalation_policy="COMMAND_POST"),
            EmergencySeverityMatrix(level="MAJOR", response_sla_mins=10, required_roles=["SECURITY", "MEDICAL", "OPERATIONS"], notification_scope="VENUE", escalation_policy="EXECUTIVE"),
            EmergencySeverityMatrix(level="HIGH", response_sla_mins=8, required_roles=["SECURITY", "MEDICAL", "POLICE"], notification_scope="VENUE", escalation_policy="EXECUTIVE"),
            EmergencySeverityMatrix(level="CRITICAL", response_sla_mins=5, required_roles=["SECURITY", "PARAMEDIC", "POLICE", "COMMAND"], notification_scope="ALL_CHANNELS", escalation_policy="DIRECTOR"),
            EmergencySeverityMatrix(level="CATASTROPHIC", response_sla_mins=3, required_roles=["ALL_RESPONDERS"], notification_scope="EMERGENCY_BROADCAST", escalation_policy="IMMEDIATE_EVAC"),
        ]
        db.session.add_all(sev_levels)
        db.session.commit()

        print("Seeding Stadium Zones...")
        zones = [
            StadiumZone(name="North Gate A", capacity=5000, current_occupancy=4200),
            StadiumZone(name="South Concourse", capacity=8000, current_occupancy=3500),
            StadiumZone(name="East VIP Entrance", capacity=1000, current_occupancy=200),
            StadiumZone(name="West Fan Zone", capacity=10000, current_occupancy=8900),
            StadiumZone(name="Medical Bay 1", capacity=50, current_occupancy=5),
        ]
        db.session.add_all(zones)
        db.session.commit()

        print("Seeding Crowd Zones & Snapshots...")
        crowd_zones = []
        for z in zones:
            cz = CrowdZone(
                name=z.name,
                max_capacity=z.capacity,
            )
            crowd_zones.append(cz)
        db.session.add_all(crowd_zones)
        db.session.commit()
        
        snapshots = []
        for z, cz in zip(zones, crowd_zones):
            snapshots.append(CrowdSnapshot(
                zone_id=cz.id,
                occupancy=z.current_occupancy
            ))
        db.session.add_all(snapshots)
        db.session.commit()

        print("Seeding Incidents...")
        incidents = [
            Incident(severity="CRITICAL", status="OPEN", zone_id=zones[3].id),
            Incident(severity="MEDIUM", status="OPEN", zone_id=zones[0].id),
            Incident(severity="LOW", status="RESOLVED", zone_id=zones[1].id),
        ]
        db.session.add_all(incidents)
        db.session.commit()
        
        db.session.add(Recommendation(incident_id=incidents[0].id, ai_confidence=0.92, proposed_action="Dispatch immediate medical and security teams. Reroute incoming fans to North Gate.", approved=False))
        db.session.add(Recommendation(incident_id=incidents[1].id, ai_confidence=0.75, proposed_action="Send maintenance to inspect turnstile 4.", approved=False))
        db.session.commit()

        print("Seeding Volunteers...")
        volunteers = [
            Volunteer(name="Elena Rodriguez", active=True, medical_training=True, mobility_assistance=True, sign_language=True, security_clearance=False),
            Volunteer(name="Marcus Chen", active=True, medical_training=False, mobility_assistance=False, sign_language=False, security_clearance=True),
            Volunteer(name="Sarah Jenkins", active=False, medical_training=True, mobility_assistance=True, sign_language=False, security_clearance=True),
        ]
        db.session.add_all(volunteers)
        db.session.commit()

        print("Seeding Transport & Parking...")
        parking = [
            ParkingZone(name="Lot A (VIP)", max_capacity=500, current_occupancy=480, zone_type="VIP"),
            ParkingZone(name="Lot B (General)", max_capacity=2000, current_occupancy=1950, zone_type="General"),
            ParkingZone(name="Lot C (Accessible)", max_capacity=200, current_occupancy=120, zone_type="ADA"),
            ParkingZone(name="Lot D (EV Charging)", max_capacity=100, current_occupancy=90, zone_type="EV"),
        ]
        db.session.add_all(parking)
        db.session.commit()

        print("Seeding Sustainability Metrics...")
        metrics = SustainabilityMetric(
            total_carbon_offset_kg=42500,
            renewable_energy_percentage=78.5,
            water_usage_liters=150000,
            recycling_rate_percentage=65.0,
            waste_diversion_percentage=82.0,
            energy_cost_savings_usd=12400.50
        )
        db.session.add(metrics)
        db.session.commit()
        
        print("Seeding Executive AI Decisions...")
        decisions = [
            AIArbitrationDecision(source_ai_domain="CROWD", action_code="REROUTE_GATE_A", priority_level="HIGH", confidence_score=0.88, trigger_event="Congestion > 85%", execution_status="EXECUTED"),
            AIArbitrationDecision(source_ai_domain="TRANSPORT", action_code="DISPATCH_SHUTTLE", priority_level="MEDIUM", confidence_score=0.91, trigger_event="Lot B Full", execution_status="PENDING"),
        ]
        db.session.add_all(decisions)
        db.session.commit()

        print("Data seeded successfully!")

if __name__ == "__main__":
    seed()
