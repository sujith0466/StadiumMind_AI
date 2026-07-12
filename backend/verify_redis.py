import os
import time
import sys
from redis import Redis
from app import create_app

app = create_app()
redis_url = app.config.get("REDIS_URL", "redis://localhost:6379/0")

print(f"--- UPSTASH REDIS / LOCAL REDIS VERIFICATION ---")
print(f"Connecting to: {redis_url}")

try:
    r = Redis.from_url(redis_url, decode_responses=True)
    
    # Connection
    print("1. Testing Connection (PING)...")
    if not r.ping():
        raise Exception("Redis PING failed")
    print("   [OK] Connection successful")
    
    # Write / Read
    print("2. Testing Write / Read...")
    r.set("stadium_test_key", "rc-1-validation")
    val = r.get("stadium_test_key")
    if val != "rc-1-validation":
        raise Exception(f"Expected 'rc-1-validation', got '{val}'")
    print("   [OK] Read/Write successful")
    
    # Update
    print("3. Testing Update...")
    r.set("stadium_test_key", "updated-value")
    val = r.get("stadium_test_key")
    if val != "updated-value":
        raise Exception("Update failed")
    print("   [OK] Update successful")
    
    # Delete
    print("4. Testing Delete...")
    r.delete("stadium_test_key")
    val = r.get("stadium_test_key")
    if val is not None:
        raise Exception("Delete failed")
    print("   [OK] Delete successful")
    
    # TTL / Expiration
    print("5. Testing TTL and Expiration...")
    r.setex("stadium_ttl_key", 1, "temp-value")
    time.sleep(1.5)
    val = r.get("stadium_ttl_key")
    if val is not None:
        raise Exception("TTL expiration failed")
    print("   [OK] TTL Expiration successful")
    
    # Cache Invalidation verification
    print("6. Cache Invalidation...")
    r.set("cache_route_dashboard", "cached-data")
    r.delete("cache_route_dashboard") # Invalidation simulation
    if r.get("cache_route_dashboard") is not None:
        raise Exception("Cache Invalidation failed")
    print("   [OK] Cache invalidation simulated successfully")

    print("--- REDIS VERIFICATION PASSED SUCCESSFULLY ---")
except Exception as e:
    print(f"--- REDIS VERIFICATION FAILED ---")
    print(str(e))
    sys.exit(1)
