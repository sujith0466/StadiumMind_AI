"""
Tests for authentication, authorization, and caching logic.
"""

import pytest
from unittest.mock import MagicMock
from app import create_app, db as _db
import cache_utils


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------
@pytest.fixture(scope="module")
def app():
    application = create_app()
    application.config["TESTING"] = True
    application.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    application.config["JWT_SECRET_KEY"] = "test-jwt-secret"
    application.config["ADMIN_USERNAME"] = "testadmin"
    application.config["ADMIN_PASSWORD"] = "testpass"
    application.config["WTF_CSRF_ENABLED"] = False

    with application.app_context():
        _db.create_all()
    yield application


@pytest.fixture(scope="module")
def client(app):
    return app.test_client()


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


def test_login_success(client):
    """Verify successful login using valid environment-based credentials."""
    response = client.post(
        "/api/auth/login", json={"username": "testadmin", "password": "testpass"}
    )
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data


def test_login_failure(client):
    """Verify failed login using invalid credentials."""
    response = client.post(
        "/api/auth/login", json={"username": "testadmin", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "Invalid credentials"

    response2 = client.post("/api/auth/login", json={})
    assert response2.status_code == 400


def test_login_rate_limiting(client):
    """Verify login rate limiting (configured limit is 5 per minute)."""
    # Use a unique IP for this test to avoid interfering with other tests
    environ = {"REMOTE_ADDR": "127.0.0.99"}

    # 5 failed logins
    for _ in range(5):
        client.post(
            "/api/auth/login", json={"username": "a", "password": "b"}, environ_base=environ
        )

    # 6th should be rate limited (429 Too Many Requests)
    response = client.post(
        "/api/auth/login", json={"username": "a", "password": "b"}, environ_base=environ
    )
    assert response.status_code == 429


def test_protected_endpoint_without_jwt(client):
    """Verify protected endpoint rejects requests without a JWT."""
    response = client.post("/api/crowd/simulation")
    assert response.status_code == 401


def test_protected_endpoint_with_jwt(client):
    """Verify protected endpoint accepts requests with a valid JWT."""
    login_resp = client.post(
        "/api/auth/login", json={"username": "testadmin", "password": "testpass"}
    )
    token = login_resp.get_json()["access_token"]

    response = client.post("/api/crowd/simulation", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.get_json()["message"] == "Crowd surge simulated"


def test_cached_endpoint_behavior(client, monkeypatch):
    """Verify cached endpoint behaves correctly across repeated requests."""
    # Mock Redis client
    mock_redis = MagicMock()
    cache_store = {}

    def mock_get(key):
        return cache_store.get(key)

    def mock_setex(key, ttl, value):
        cache_store[key] = value

    mock_redis.get.side_effect = mock_get
    mock_redis.setex.side_effect = mock_setex

    monkeypatch.setattr(cache_utils, "get_redis_client", lambda: mock_redis)

    # First request: should call the view function and cache the result
    response1 = client.get("/api/crowd/zones")
    assert response1.status_code == 200
    assert len(cache_store) > 0

    # Second request: should return cached data
    # We can verify this by checking if the response matches what we put in cache
    response2 = client.get("/api/crowd/zones")
    assert response2.status_code == 200
    assert response1.get_json() == response2.get_json()

    # Verify mock was called
    assert mock_redis.get.called


def test_redis_failure_fallback(client, monkeypatch):
    """Verify Redis failure triggers graceful fallback without returning a server error."""
    # Mock Redis client to raise Exception
    mock_redis = MagicMock()
    mock_redis.get.side_effect = Exception("Redis connection failed")

    monkeypatch.setattr(cache_utils, "get_redis_client", lambda: mock_redis)

    # Request should still succeed and bypass cache gracefully
    response = client.get("/api/crowd/zones")
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)
