from flask import Blueprint, jsonify, request
from models_emergency import db, EmergencyIncident, ProtocolDocument, KnowledgeQuery

emergency_bp = Blueprint('emergency', __name__, url_prefix='/api/emergency')
knowledge_bp = Blueprint('knowledge', __name__, url_prefix='/api/knowledge')

@emergency_bp.route('/incidents', methods=['GET', 'POST'])
def handle_incidents():
    # CRUD for high-severity events
    if request.method == 'POST':
        return jsonify({"message": "Incident escalated"}), 201
    return jsonify([]), 200

@emergency_bp.route('/evacuations', methods=['POST'])
def trigger_evacuation():
    # Evacuation plan triggers
    return jsonify({"message": "Evacuation triggered"}), 201

@knowledge_bp.route('/query', methods=['POST'])
def query_knowledge_base():
    # RAG-based AI assistant endpoint
    return jsonify({
        "question": "What is the protocol for severe weather?",
        "ai_answer": "According to the Weather Protocol, immediately direct fans to the lower concourse.",
        "cited_protocol_id": 12
    }), 200
