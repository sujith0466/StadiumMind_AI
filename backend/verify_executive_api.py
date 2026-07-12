import sys, os
sys.path.insert(0, os.path.abspath('d:/StadiumMind-AI/backend/api'))
sys.path.insert(0, os.path.abspath('d:/StadiumMind-AI/backend'))
from app import create_app

app = create_app()

def test_endpoint(client, path):
    try:
        response = client.get(path)
        print(f"GET {path} -> HTTP {response.status_code}")
        if response.status_code == 200:
            print("Response:", response.json)
        else:
            print("Error:", response.data)
    except Exception as e:
        print(f"Failed to fetch {path}: {e}")

with app.app_context():
    with app.test_client() as client:
        test_endpoint(client, "/api/executive/dashboard")
        test_endpoint(client, "/api/executive/kpis")
        test_endpoint(client, "/api/executive/analytics")
        test_endpoint(client, "/api/executive/summary")

