import sys
import os
import json
import time
sys.path.append(os.path.abspath('backend'))
from app import create_app
from cache_utils import _redis_client

def test():
    app = create_app()
    app.config["ADMIN_USERNAME"] = "admin"
    app.config["ADMIN_PASSWORD"] = "admin123"
    client = app.test_client()

    print("--- 1. Testing public endpoint (Dashboard GET) ---")
    r = client.get("/api/executive/dashboard")
    print(f"Status: {r.status_code}")
    assert r.status_code == 200

    print("\n--- 2. Testing protected endpoint without auth (401) ---")
    r = client.post("/api/orchestrator/resolve", json={"recommendations": []})
    print(f"Status: {r.status_code}")
    print(f"Response: {r.get_data(as_text=True)}")
    assert r.status_code == 401

    print("\n--- 3. Testing successful login using credentials ---")
    r = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    print(f"Status: {r.status_code}")
    token = r.get_json().get("access_token")
    if token:
        print("Token received successfully.")
    else:
        print("Failed to get token!")
        return
    assert r.status_code == 200

    print("\n--- 4. Testing protected endpoint with valid JWT ---")
    headers = {"Authorization": f"Bearer {token}"}
    r = client.post("/api/orchestrator/resolve", json={"recommendations": []}, headers=headers)
    print(f"Status: {r.status_code}")
    assert r.status_code == 200

    print("\n--- 5. Testing Redis Cache (Hit) ---")
    # First request
    start = time.time()
    r1 = client.get("/api/executive/kpis")
    t1 = time.time() - start
    print(f"First request (Miss) took: {t1:.4f}s, Status: {r1.status_code}")

    # Second request
    start = time.time()
    r2 = client.get("/api/executive/kpis")
    t2 = time.time() - start
    print(f"Second request (Hit) took: {t2:.4f}s, Status: {r2.status_code}")
    if t2 < t1:
        print("Cache HIT confirmed (faster response).")
    
    print("\n--- 6. Testing Redis Fallback (Miss) ---")
    # Simulate Redis failure by pointing to a bad port
    app.config["REDIS_URL"] = "redis://localhost:9999/0"
    # reset the global client
    import cache_utils
    cache_utils._redis_client = None
    
    start = time.time()
    r3 = client.get("/api/executive/kpis")
    t3 = time.time() - start
    print(f"Request with dead Redis took: {t3:.4f}s, Status: {r3.status_code}")
    assert r3.status_code == 200
    print("Fallback successful!")
    print("\nALL VERIFICATIONS PASSED!")

if __name__ == "__main__":
    test()
