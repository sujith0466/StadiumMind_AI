"""
StadiumMind AI — Unified Flask Application Factory
Registers all modular blueprints and initializes core extensions.
"""

import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

db = SQLAlchemy()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address, default_limits=["200 per minute"])


def create_app(config_class=None):
    app = Flask(__name__)

    # --- Configuration ---
    from dotenv import load_dotenv

    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"), override=True)

    if config_class:
        app.config.from_object(config_class)
    else:
        app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
        db_url = os.environ.get(
            "DATABASE_URL",
            "postgresql://stadium_admin:stadium_password@localhost:5432/stadium_mind",
        )
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        app.config["SQLALCHEMY_DATABASE_URI"] = db_url
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-jwt-secret")
        app.config["REDIS_URL"] = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

    # --- Extensions ---
    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": os.environ.get("CORS_ORIGINS", "*")}})

    # --- Security Headers ---
    @app.after_request
    def apply_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Cache-Control"] = "no-store"
        return response

    # --- Root Index ---
    @app.route("/", methods=["GET"])
    def index():
        return (
            jsonify(
                {
                    "status": "ok",
                    "message": "Backend is running",
                    "application": "StadiumMind AI",
                    "version": "1.0.0",
                }
            ),
            200,
        )

    # --- Health Check ---
    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "version": "1.0.0"}), 200

    # --- Register Blueprints ---
    from api.ops import ops_bp
    from api.crowd import crowd_bp
    from api.volunteers import volunteer_bp, accessibility_bp
    from api.transport import transport_bp, sustainability_bp
    from api.emergency import emergency_bp, knowledge_bp
    from api.fan import fan_bp
    from api.orchestrator import orchestrator_bp, executive_bp

    app.register_blueprint(ops_bp)
    app.register_blueprint(crowd_bp)
    app.register_blueprint(volunteer_bp)
    app.register_blueprint(accessibility_bp)
    app.register_blueprint(transport_bp)
    app.register_blueprint(sustainability_bp)
    app.register_blueprint(emergency_bp)
    app.register_blueprint(knowledge_bp)
    app.register_blueprint(fan_bp)
    app.register_blueprint(orchestrator_bp)
    app.register_blueprint(executive_bp)

    # --- Initialize DB tables (for testing and first-run) ---
    with app.app_context():
        db.create_all()

        # Auto-seed production database if empty
        try:
            from models import StadiumZone

            if not db.session.query(StadiumZone.query.exists()).scalar():
                from production_seed import (
                    seed_stadium_zones,
                    seed_emergency,
                    seed_operations,
                    seed_crowd,
                    seed_volunteers,
                    seed_transport,
                )

                print("Auto-seeding empty database on startup...")
                seed_stadium_zones()
                seed_emergency()
                seed_operations()
                seed_crowd()
                seed_volunteers()
                seed_transport()
                print("Database auto-seeding complete.")
        except Exception as e:
            print(f"Auto-seed failed: {e}")

    return app


if __name__ == "__main__":
    from app import create_app

    app = create_app()
    app.run(debug=False, host="0.0.0.0", port=5000)
