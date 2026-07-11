"""
StadiumMind AI — Fan Experience BFF API
Backend-For-Frontend aggregating cross-phase intelligence for the fan portal.
Consumes: Operations, Crowd, Transport, Emergency, Volunteer domains.
"""
import re
from flask import Blueprint, jsonify, request

fan_bp = Blueprint("fan", __name__, url_prefix="/api/fan")

_INJECTION_PATTERNS = re.compile(
    r"(ignore previous|disregard|you are now|system:|act as|jailbreak)",
    re.IGNORECASE,
)

MULTILINGUAL_TEMPLATES = {
    "en": "For {topic}, please {action}.",
    "es": "Para {topic}, por favor {action}.",
    "fr": "Pour {topic}, veuillez {action}.",
    "de": "Für {topic}, bitte {action}.",
}

KNOWLEDGE_BASE = {
    "restroom": {
        "topic": "restroom",
        "action": "follow the blue wayfinding signs to the nearest facility on your concourse level",
    },
    "exit": {
        "topic": "exiting",
        "action": "proceed to your nearest gate — green-lit exits are clear of congestion",
    },
    "medical": {
        "topic": "medical assistance",
        "action": "contact the nearest volunteer in a red vest or dial extension 9000",
    },
    "food": {
        "topic": "food and beverages",
        "action": "visit any concession stand on Level 1 or Level 3 — wait times are under 5 minutes",
    },
    "parking": {
        "topic": "parking",
        "action": "follow the dynamic signs to Lot B (recommended). ADA spaces are reserved in Lot A.",
    },
    "shuttle": {
        "topic": "shuttles",
        "action": "board the Blue Line shuttle at the North entrance — next departure in 8 minutes",
    },
    "wheelchair": {
        "topic": "wheelchair assistance",
        "action": "call extension 4400 or approach any volunteer with a blue vest",
    },
    "emergency": {
        "topic": "emergencies",
        "action": "follow evacuation signs and move calmly toward the nearest lit exit",
    },
}


def _sanitize(text: str) -> str:
    return _INJECTION_PATTERNS.sub("[REDACTED]", text).strip()


def _multilingual_response(query: str, lang: str) -> dict:
    """Keyword-based multilingual assistant with grounded templates."""
    query_lower = query.lower()
    for keyword, content in KNOWLEDGE_BASE.items():
        if keyword in query_lower:
            template = MULTILINGUAL_TEMPLATES.get(lang, MULTILINGUAL_TEMPLATES["en"])
            response_text = template.format(
                topic=content["topic"], action=content["action"]
            )
            return {"response": response_text, "grounded": True, "keyword_matched": keyword}
    # Fallback
    return {
        "response": "Please ask a venue staff member or visit the Information Desk at Gate 1.",
        "grounded": False,
        "keyword_matched": None,
    }


@fan_bp.route("/dashboard/<int:fan_id>", methods=["GET"])
def get_fan_dashboard(fan_id):
    """
    BFF aggregator for the Fan Portal.
    Consolidates: live match data, crowd advisories, emergency status, transport, offline cache.
    """
    return jsonify({
        "fan_id": fan_id,
        "live_match": {
            "title": "Championship Finals",
            "home_team": "City FC",
            "away_team": "Rival United",
            "score": "2 - 1",
            "status": "LIVE",
            "minute": 68,
        },
        "advisories": [
            "Gate 2 experiencing heavy congestion. Rerouting via Gate 4 recommended.",
        ],
        "emergency_status": "NORMAL",
        "transport": {
            "recommended_parking": "Lot B — 72% full",
            "shuttle": "Blue Line — next in 8 mins",
            "best_entrance": "Gate 4",
        },
        "crowd_density_index": 0.72,
        "offline_cache_ready": True,
    }), 200


@fan_bp.route("/journey", methods=["GET"])
def get_fan_journey():
    """Returns the complete 9-step fan journey mapped to platform intelligence modules."""
    steps = [
        {"step_name": "ARRIVAL", "mapped_intelligence_module": "Transport Intelligence",
         "description": "AI traffic guidance & best entrance recommendation."},
        {"step_name": "PARKING", "mapped_intelligence_module": "Transport Intelligence",
         "description": "Real-time smart parking lot occupancy with ADA reserved spaces."},
        {"step_name": "ENTRY", "mapped_intelligence_module": "Crowd Intelligence",
         "description": "Gate queue wait times & throughput optimization."},
        {"step_name": "SEAT", "mapped_intelligence_module": "Crowd Intelligence",
         "description": "Wayfinding & crowd density heatmap for concourse navigation."},
        {"step_name": "FOOD", "mapped_intelligence_module": "Operations Intelligence",
         "description": "Concession wait times & mobile ordering recommendations."},
        {"step_name": "RESTROOM", "mapped_intelligence_module": "Volunteer & Accessibility Intelligence",
         "description": "ADA-compliant restroom locator with barrier-free routing."},
        {"step_name": "MATCH", "mapped_intelligence_module": "Fan Experience Portal",
         "description": "Live match stats & multilingual AI FAQ assistant."},
        {"step_name": "EXIT", "mapped_intelligence_module": "Emergency & Crowd Intelligence",
         "description": "Safe route & evacuation wayfinding away from congestion."},
        {"step_name": "TRANSPORT_HOME", "mapped_intelligence_module": "Transport Intelligence",
         "description": "EV charging status & shuttle departure times."},
    ]
    return jsonify(steps), 200


@fan_bp.route("/assistant", methods=["POST"])
def query_multilingual_assistant():
    """
    Multilingual Fan AI Assistant.
    Sanitizes input, matches against grounded knowledge base, returns localized response.
    Supports: en, es, fr, de.
    """
    data = request.get_json() or {}
    raw_query = data.get("query", "")
    lang = data.get("preferred_language", "en")

    if not raw_query:
        return jsonify({"error": "query is required"}), 400

    clean_query = _sanitize(raw_query)
    if lang not in MULTILINGUAL_TEMPLATES:
        lang = "en"

    result = _multilingual_response(clean_query, lang)
    return jsonify({
        "query": clean_query,
        "language": lang,
        **result,
    }), 200


@fan_bp.route("/pois", methods=["GET"])
def get_pois():
    """Return venue Points of Interest with accessibility flags."""
    return jsonify([
        {"id": 1, "name": "First Aid Station A", "category": "MEDICAL", "zone_id": 2, "accessibility_equipped": True},
        {"id": 2, "name": "Family Restroom Block 3", "category": "RESTROOM", "zone_id": 3, "accessibility_equipped": True},
        {"id": 3, "name": "Concession Stand North", "category": "FOOD", "zone_id": 1, "accessibility_equipped": True},
        {"id": 4, "name": "Main Club Shop", "category": "MERCH", "zone_id": 5, "accessibility_equipped": True},
        {"id": 5, "name": "Gate 4 (Recommended Entry)", "category": "ENTRANCE", "zone_id": 4, "accessibility_equipped": True},
    ]), 200
