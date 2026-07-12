import os
import json
from datetime import datetime, timedelta, timezone
import random

from app import create_app, db

# Import models
from models_emergency import EmergencySeverityMatrix, EmergencyIncident, FirstResponder, EvacuationPlan, ProtocolDocument
from models import StadiumZone, Incident, OperationEvent, UserAssignment, Recommendation
from models_crowd import CrowdZone, CrowdSnapshot, SafeRoute, DensityAlert, MovementPattern
from models_volunteer import Volunteer, VolunteerTask
from models_transport import ParkingZone, ShuttleRoute, SustainabilityMetric, TransportAlert

app = create_app()

SEED_VERSION = "v1.0.0"
MANIFEST_PATH = os.path.join(os.path.dirname(__file__), 'seed_manifest.json')

def load_manifest():
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, 'r') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_manifest(manifest):
    with open(MANIFEST_PATH, 'w') as f:
        json.dump(manifest, f, indent=4)

def update_manifest(module, table, records_inserted, status):
    manifest = load_manifest()
    if module not in manifest:
        manifest[module] = {}
    
    manifest[module][table] = {
        "Seed Version": SEED_VERSION,
        "Records Inserted": records_inserted,
        "Last Seed Timestamp": datetime.now(timezone.utc).isoformat(),
        "Status": status
    }
    save_manifest(manifest)

def get_historical_timestamps(count=20):
    timestamps = []
    now = datetime.now(timezone.utc)
    # Live events (last 4 hours)
    for _ in range(count // 4):
        timestamps.append(now - timedelta(minutes=random.randint(5, 240)))
    # Yesterday
    for _ in range(count // 4):
        timestamps.append(now - timedelta(days=1, minutes=random.randint(0, 1440)))
    # 7 days ago
    for _ in range(count // 4):
        timestamps.append(now - timedelta(days=random.randint(2, 7), minutes=random.randint(0, 1440)))
    # 30 days ago
    for _ in range(count - len(timestamps)):
        timestamps.append(now - timedelta(days=random.randint(8, 30), minutes=random.randint(0, 1440)))
    
    timestamps.sort()
    return timestamps

def seed_stadium_zones():
    # Stadium Zones are foundational for Operations and Emergency
    module_name = "Foundation"
    try:
        if not db.session.query(StadiumZone.query.exists()).scalar():
            zones = [
                StadiumZone(name="North Gate A", capacity=15000, current_occupancy=4200),
                StadiumZone(name="South Concourse", capacity=25000, current_occupancy=13500),
                StadiumZone(name="East VIP Entrance", capacity=2000, current_occupancy=800),
                StadiumZone(name="West Fan Zone", capacity=20000, current_occupancy=18900),
                StadiumZone(name="Medical Bay 1", capacity=150, current_occupancy=15),
                StadiumZone(name="Food Court Alpha", capacity=5000, current_occupancy=4800),
                StadiumZone(name="Media Center", capacity=800, current_occupancy=400),
                StadiumZone(name="Locker Room Area", capacity=300, current_occupancy=100),
                StadiumZone(name="Lower Bowl Seating", capacity=30000, current_occupancy=28000),
                StadiumZone(name="Upper Bowl Seating", capacity=40000, current_occupancy=35000),
            ]
            db.session.add_all(zones)
            db.session.flush()
            update_manifest(module_name, "StadiumZone", len(zones), "Success")
            print(f"Inserted {len(zones)} StadiumZone records.")
        else:
            update_manifest(module_name, "StadiumZone", 0, "Skipped")
            print("Skipped StadiumZone (already exists).")
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        update_manifest(module_name, "ALL", 0, f"Failed: {str(e)}")
        print(f"[FAILED] Failed to seed {module_name}. Error: {str(e)}\n")

def seed_emergency():
    print("--- Seeding Emergency Module ---")
    module_name = "Emergency"
    try:
        # Seed Severity Matrix
        if not db.session.query(EmergencySeverityMatrix.query.exists()).scalar():
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
            db.session.flush()
            update_manifest(module_name, "EmergencySeverityMatrix", len(sev_levels), "Success")
            print(f"Inserted {len(sev_levels)} EmergencySeverityMatrix records.")
        else:
            update_manifest(module_name, "EmergencySeverityMatrix", 0, "Skipped")
            print("Skipped EmergencySeverityMatrix (already exists).")
        
        # Seed First Responders
        if not db.session.query(FirstResponder.query.exists()).scalar():
            responders = [
                FirstResponder(name="Paramedic Unit Alpha", unit_type="MEDICAL", status="AVAILABLE", current_zone_id=1),
                FirstResponder(name="Paramedic Unit Bravo", unit_type="MEDICAL", status="DISPATCHED", current_zone_id=2),
                FirstResponder(name="Security Team Delta", unit_type="SECURITY", status="AVAILABLE", current_zone_id=3),
                FirstResponder(name="Security Team Echo", unit_type="SECURITY", status="ON_SCENE", current_zone_id=4),
                FirstResponder(name="Fire Squad 1", unit_type="FIRE", status="AVAILABLE", current_zone_id=5),
                FirstResponder(name="Police K9 Unit", unit_type="POLICE", status="PATROLLING", current_zone_id=1),
            ]
            db.session.add_all(responders)
            db.session.flush()
            update_manifest(module_name, "FirstResponder", len(responders), "Success")
            print(f"Inserted {len(responders)} FirstResponder records.")
        else:
            update_manifest(module_name, "FirstResponder", 0, "Skipped")
            print("Skipped FirstResponder (already exists).")

        # Seed Emergency Incidents
        existing_incidents_count = db.session.query(EmergencyIncident).count()
        if existing_incidents_count < 20:
            zone_ids = [z.id for z in db.session.query(StadiumZone).all()]
            if not zone_ids: zone_ids = [1]
            timestamps = get_historical_timestamps(30)
            incidents_to_add = []
            types = [
                ("MEDICAL", "MINOR"), ("MEDICAL", "MEDIUM"), ("MEDICAL", "HIGH"),
                ("SECURITY", "LOW"), ("SECURITY", "MAJOR"), ("SECURITY", "CRITICAL"),
                ("WEATHER", "ADVISORY"), ("WEATHER", "HIGH")
            ]
            
            for i, ts in enumerate(timestamps):
                inc_type, severity = random.choice(types)
                # Naive offset datetime logic (py 3.13)
                status = "RESOLVED" if ts < datetime.now(timezone.utc) - timedelta(days=1) else random.choice(["ACTIVE", "UNDER_INVESTIGATION", "RESOLVED"])
                inc = EmergencyIncident(
                    severity=severity,
                    incident_type=inc_type,
                    zone_id=random.choice(zone_ids),
                    status=status,
                    timestamp=ts
                )
                incidents_to_add.append(inc)
            
            db.session.add_all(incidents_to_add)
            db.session.flush()
            update_manifest(module_name, "EmergencyIncident", len(incidents_to_add), "Success")
            print(f"Inserted {len(incidents_to_add)} EmergencyIncident records.")
        else:
            update_manifest(module_name, "EmergencyIncident", 0, "Skipped")
            print("Skipped EmergencyIncident (already exists enough records).")
            
        db.session.commit()
        print(f"[SUCCESS] Module {module_name} Seeded and Committed Successfully.\n")

    except Exception as e:
        db.session.rollback()
        update_manifest(module_name, "ALL", 0, f"Failed: {str(e)}")
        print(f"[FAILED] Failed to seed {module_name}. Rolled back transaction. Error: {str(e)}\n")

def seed_operations():
    print("--- Seeding Operations Module ---")
    module_name = "Operations"
    try:
        # Operations Incident (General)
        existing_count = db.session.query(Incident).count()
        if existing_count < 20:
            zone_ids = [z.id for z in db.session.query(StadiumZone).all()]
            if not zone_ids: zone_ids = [1]
            timestamps = get_historical_timestamps(25)
            incidents = []
            for ts in timestamps:
                inc = Incident(
                    severity=random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
                    status=random.choice(["OPEN", "RESOLVED", "IN_PROGRESS"]),
                    zone_id=random.choice(zone_ids),
                    created_at=ts
                )
                incidents.append(inc)
            db.session.add_all(incidents)
            db.session.flush()

            # Add Recommendations
            for inc in incidents:
                rec = Recommendation(
                    incident_id=inc.id,
                    ai_confidence=round(random.uniform(0.60, 0.99), 2),
                    proposed_action=random.choice([
                        "Dispatch cleaning crew immediately.",
                        "Reroute fans away from this zone.",
                        "Inspect turnstile for hardware failure.",
                        "Coordinate with VIP transport.",
                        "Verify ID badges of personnel in area."
                    ]),
                    approved=random.choice([True, False])
                )
                db.session.add(rec)

            update_manifest(module_name, "Incident", len(incidents), "Success")
            print(f"Inserted {len(incidents)} Incident/Recommendation records.")
        else:
            update_manifest(module_name, "Incident", 0, "Skipped")
            print("Skipped Incident (already exists).")
            
        # Operation Events (Broadcast, VIP, Maintenance)
        if not db.session.query(OperationEvent.query.exists()).scalar():
            events = []
            timestamps = get_historical_timestamps(20)
            for ts in timestamps:
                events.append(OperationEvent(
                    event_type=random.choice(["VIP_ARRIVAL", "MAINTENANCE_CHECK", "CLEANING_SCHEDULE", "BROADCAST_SETUP", "SECURITY_SWEEP"]),
                    payload={"detail": "Routine stadium operational event logged.", "shift": "Evening", "authorized_by": "Ops Director"},
                    timestamp=ts
                ))
            db.session.add_all(events)
            db.session.flush()
            update_manifest(module_name, "OperationEvent", len(events), "Success")
            print(f"Inserted {len(events)} OperationEvent records.")
        else:
            update_manifest(module_name, "OperationEvent", 0, "Skipped")
            print("Skipped OperationEvent (already exists).")
            
        db.session.commit()
        print(f"[SUCCESS] Module {module_name} Seeded and Committed Successfully.\n")
    except Exception as e:
        db.session.rollback()
        update_manifest(module_name, "ALL", 0, f"Failed: {str(e)}")
        print(f"[FAILED] Failed to seed {module_name}. Error: {str(e)}\n")

def seed_crowd():
    print("--- Seeding Crowd Module ---")
    module_name = "Crowd"
    try:
        if not db.session.query(CrowdZone.query.exists()).scalar():
            zones = [
                CrowdZone(name="North Gate A", max_capacity=15000),
                CrowdZone(name="South Concourse", max_capacity=25000),
                CrowdZone(name="East VIP Entrance", max_capacity=2000),
                CrowdZone(name="West Fan Zone", max_capacity=20000),
                CrowdZone(name="Food Court Alpha", max_capacity=5000),
                CrowdZone(name="Lower Bowl Seating", max_capacity=30000),
                CrowdZone(name="Upper Bowl Seating", max_capacity=40000),
            ]
            db.session.add_all(zones)
            db.session.flush()

            # Seed Historical Snapshots for Crowd
            snapshots = []
            timestamps = get_historical_timestamps(40)
            for cz in zones:
                for ts in timestamps:
                    # random occupancy between 20% and 95%
                    occ = int(cz.max_capacity * random.uniform(0.2, 0.95))
                    snapshots.append(CrowdSnapshot(
                        zone_id=cz.id,
                        occupancy=occ,
                        timestamp=ts
                    ))
            db.session.add_all(snapshots)
            update_manifest(module_name, "CrowdZone", len(zones), "Success")
            print(f"Inserted {len(zones)} CrowdZone and {len(snapshots)} Snapshot records.")
        else:
            update_manifest(module_name, "CrowdZone", 0, "Skipped")
            print("Skipped CrowdZone (already exists).")

        db.session.commit()
        print(f"[SUCCESS] Module {module_name} Seeded and Committed Successfully.\n")
    except Exception as e:
        db.session.rollback()
        update_manifest(module_name, "ALL", 0, f"Failed: {str(e)}")
        print(f"[FAILED] Failed to seed {module_name}. Error: {str(e)}\n")

def seed_volunteer():
    print("--- Seeding Volunteers Module ---")
    module_name = "Volunteers"
    try:
        existing_volunteers = db.session.query(Volunteer).count()
        if existing_volunteers < 20:
            volunteers = []
            first_names = ["Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Isabella", "William", "Sophia", "Elijah"]
            last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
            for i in range(50):
                vol = Volunteer(
                    name=f"{random.choice(first_names)} {random.choice(last_names)}",
                    active=random.choice([True, True, True, False]),
                    medical_training=random.choice([True, False]),
                    mobility_assistance=random.choice([True, False]),
                    sign_language=random.choice([True, False]),
                    security_clearance=random.choice([True, False])
                )
                volunteers.append(vol)
            db.session.add_all(volunteers)
            db.session.flush()

            tasks = []
            timestamps = get_historical_timestamps(30)
            for ts in timestamps:
                task = VolunteerTask(
                    description=random.choice(["Wheelchair assistance at Gate A", "Lost child escort", "VIP entrance check", "Medical tent standby"]),
                    status=random.choice(["PENDING", "IN_PROGRESS", "COMPLETED"]),
                    created_at=ts
                )
                tasks.append(task)
            db.session.add_all(tasks)

            update_manifest(module_name, "Volunteer", len(volunteers), "Success")
            print(f"Inserted {len(volunteers)} Volunteer and {len(tasks)} Task records.")
        else:
            update_manifest(module_name, "Volunteer", 0, "Skipped")
            print("Skipped Volunteer (already exists).")
        db.session.commit()
        print(f"[SUCCESS] Module {module_name} Seeded and Committed Successfully.\n")
    except Exception as e:
        db.session.rollback()
        update_manifest(module_name, "ALL", 0, f"Failed: {str(e)}")
        print(f"[FAILED] Failed to seed {module_name}. Error: {str(e)}\n")

def seed_transport():
    print("--- Seeding Transport Module ---")
    module_name = "Transport"
    try:
        existing_parking = db.session.query(ParkingZone).count()
        if existing_parking < 5:
            parking = [
                ParkingZone(name="Lot A (VIP)", max_capacity=500, current_occupancy=random.randint(400, 500), zone_type="VIP"),
                ParkingZone(name="Lot B (General)", max_capacity=5000, current_occupancy=random.randint(2000, 4800), zone_type="General"),
                ParkingZone(name="Lot C (Accessible)", max_capacity=300, current_occupancy=random.randint(100, 250), zone_type="ADA"),
                ParkingZone(name="Lot D (EV Charging)", max_capacity=200, current_occupancy=random.randint(50, 190), zone_type="EV"),
                ParkingZone(name="Lot E (Media)", max_capacity=150, current_occupancy=140, zone_type="Media"),
            ]
            db.session.add_all(parking)
            
            sustainability = SustainabilityMetric(
                total_carbon_offset_kg=42500,
                renewable_energy_percentage=78.5,
                water_usage_liters=150000,
                recycling_rate_percentage=65.0,
                waste_diversion_percentage=82.0,
                energy_cost_savings_usd=12400.50
            )
            db.session.add(sustainability)
            
            db.session.flush()
            update_manifest(module_name, "ParkingZone", len(parking), "Success")
            print(f"Inserted {len(parking)} ParkingZone records.")
        else:
            update_manifest(module_name, "ParkingZone", 0, "Skipped")
            print("Skipped ParkingZone (already exists).")
        
        db.session.commit()
        print(f"[SUCCESS] Module {module_name} Seeded and Committed Successfully.\n")
    except Exception as e:
        db.session.rollback()
        update_manifest(module_name, "ALL", 0, f"Failed: {str(e)}")
        print(f"[FAILED] Failed to seed {module_name}. Error: {str(e)}\n")


if __name__ == "__main__":
    with app.app_context():
        # Ensure DB Tables exist
        db.create_all()
        
        # Seed dependencies first
        seed_stadium_zones()
        
        # Seed 5 target modules in isolated transactions
        seed_emergency()
        seed_operations()
        seed_crowd()
        seed_volunteer()
        seed_transport()
        
        print("\n[COMPLETE] Production Seeding Process finished.")
