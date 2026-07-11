"""
StadiumMind AI — Backend Test Suite
Verifies all critical API routes respond with correct status codes.
"""
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["JWT_SECRET_KEY"] = "test-jwt-secret"
    with app.test_client() as client:
        yield client


class TestHealthEndpoint:
    """P12-M3: Core health check must return 200 OK with version tag."""
    def test_health_check(self, client):
        response = client.get('/health')
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "ok"
        assert "version" in data


class TestOpsEndpoints:
    """P12-M3: Verify Operations Intelligence API routes."""
    def test_get_incidents(self, client):
        response = client.get('/api/ops/incidents')
        assert response.status_code == 200
        assert isinstance(response.get_json(), list)

    def test_get_ops_dashboard(self, client):
        response = client.get('/api/ops/dashboard')
        assert response.status_code == 200


class TestCrowdEndpoints:
    """P12-M3: Verify Crowd Intelligence API routes."""
    def test_get_crowd_zones(self, client):
        response = client.get('/api/crowd/zones')
        assert response.status_code == 200
        assert isinstance(response.get_json(), list)

    def test_get_crowd_routes(self, client):
        response = client.get('/api/crowd/routes')
        assert response.status_code == 200


class TestEmergencyEndpoints:
    """P12-M3: Verify Emergency Intelligence API routes."""
    def test_get_emergency_incidents(self, client):
        response = client.get('/api/emergency/incidents')
        assert response.status_code == 200

    def test_knowledge_query(self, client):
        response = client.post('/api/knowledge/query',
                               json={"question": "What is the severe weather protocol?"},
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert "ai_answer" in data
        assert "cited_protocol_id" in data


class TestFanEndpoints:
    """P12-M3: Verify Fan Experience BFF API routes."""
    def test_fan_dashboard(self, client):
        response = client.get('/api/fan/dashboard/1')
        assert response.status_code == 200
        data = response.get_json()
        assert "fan_id" in data
        assert "emergency_status" in data

    def test_fan_journey(self, client):
        response = client.get('/api/fan/journey')
        assert response.status_code == 200
        steps = response.get_json()
        assert isinstance(steps, list)
        assert len(steps) == 9

    def test_multilingual_assistant(self, client):
        response = client.post('/api/fan/assistant',
                               json={"query": "Where is the nearest restroom?", "preferred_language": "es"},
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert "response" in data
        assert "ES" in data["response"]


class TestOrchestratorEndpoints:
    """P12-M3: Verify Unified AI Orchestrator API routes."""
    def test_get_decisions(self, client):
        response = client.get('/api/orchestrator/decisions')
        assert response.status_code == 200
        decisions = response.get_json()
        assert isinstance(decisions, list)
        assert decisions[0]["confidence_score"] >= 0.0

    def test_executive_dashboard(self, client):
        response = client.get('/api/executive/dashboard')
        assert response.status_code == 200
        data = response.get_json()
        assert "platform_status" in data
        assert "services_health" in data


class TestAIConflictResolver:
    """P12-M3: Verify deterministic AI conflict resolution logic."""
    def test_emergency_wins_over_transport(self):
        from services.orchestrator_ai import resolve_ai_conflicts
        recs = [
            {"domain": "TRANSPORT", "action": "Open Gate 4"},
            {"domain": "EMERGENCY", "action": "Close Gate 4 — CODE RED"},
            {"domain": "CROWD", "action": "Reroute Gate 4 fans"},
        ]
        result = resolve_ai_conflicts(recs)
        winner = result["authoritative_decision"]
        assert winner["domain"] == "EMERGENCY"

    def test_empty_recommendations(self):
        from services.orchestrator_ai import resolve_ai_conflicts
        result = resolve_ai_conflicts([])
        assert result["authoritative_decision"] is None
