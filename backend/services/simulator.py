import time
import threading
import random

# from redis import Redis

# redis_client = Redis(host='localhost', port=6379, db=0)


def simulate_crowd_dynamics():
    """
    Background simulation loop for Crowd Intelligence.
    Updates Redis with simulated occupancy data to trigger Density Alerts.
    """
    while True:
        try:
            # Simulate updating zones
            zones = [1, 2, 3, 4]
            for zone_id in zones:
                fake_occupancy = random.randint(100, 5000)
                # redis_client.set(f"zone:{zone_id}:occupancy", fake_occupancy)

                # Check thresholds
                if fake_occupancy > 4000:
                    print(f"[SIMULATOR] ALERT: High density in Zone {zone_id}")
                    # SocketIO emit would go here
        except Exception as e:
            print(f"Simulation error: {e}")

        time.sleep(5)  # 5 second interval


def start_simulation_thread():
    thread = threading.Thread(target=simulate_crowd_dynamics, daemon=True)
    thread.start()
