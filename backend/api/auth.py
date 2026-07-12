from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import create_access_token
from app import limiter

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    data = request.get_json()
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Missing username or password"}), 400

    username = data.get("username")
    password = data.get("password")

    admin_username = current_app.config.get("ADMIN_USERNAME", "admin")
    admin_password = current_app.config.get("ADMIN_PASSWORD", "admin123")

    if username == admin_username and password == admin_password:
        access_token = create_access_token(identity=username)
        return jsonify({"access_token": access_token}), 200
    
    return jsonify({"error": "Invalid credentials"}), 401
