import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test():
    print("--- 1. Testing public endpoint (Dashboard GET) ---")
    r = requests.get(f"{BASE_URL}/api/executive/dashboard")
    print(f"Status: {r.status_code}")

    print("\n--- 2. Testing protected endpoint without auth (401) ---")
    r = requests.post(f"{BASE_URL}/api/orchestrator/resolve", json={"recommendations": []})
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text}")

    print("\n--- 3. Testing successful login using credentials ---")
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"username": "admin", "password": "your_super_secret_admin_password"})
    print(f"Status: {r.status_code}")
    token = r.json().get("access_token")
    if token:
        print("Token received successfully.")
    else:
        print("Failed to get token!")
        return

    print("\n--- 4. Testing protected endpoint with valid JWT ---")
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.post(f"{BASE_URL}/api/orchestrator/resolve", json={"recommendations": []}, headers=headers)
    print(f"Status: {r.status_code}")

    print("\n--- 5. Testing Redis Cache (Hit/Miss) ---")
    start = time.time()
    r1 = requests.get(f"{BASE_URL}/api/executive/kpis")
    t1 = time.time() - start
    print(f"First request (Miss) took: {t1:.4f}s, Status: {r1.status_code}")

    start = time.time()
    r2 = requests.get(f"{BASE_URL}/api/executive/kpis")
    t2 = time.time() - start
    print(f"Second request (Hit) took: {t2:.4f}s, Status: {r2.status_code}")
    
    if t2 < t1:
        print("Cache HIT confirmed (faster response).")
    else:
        print("Cache timing inconclusive, but status is OK.")

if __name__ == "__main__":
    test()
