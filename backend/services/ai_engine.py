"""
StadiumMind AI — AI Engine (upgraded)
Now routes operational triage recommendations through the Unified AI Gateway.
"""
import json
from services.ai_gateway import query_ai

def generate_recommendation(incident_context: dict) -> dict:
    """
    Constructs prompt from incident context and requests triage recommendation
    via the Unified AI Gateway (OpenRouter -> Gemini -> Local).
    """
    severity = incident_context.get("severity", "LOW")
    incident_id = incident_context.get("incident_id", 0)
    
    prompt = f"Stadium incident {incident_id} reported with severity {severity}. Provide a concise 1-sentence recommended action for stadium operations staff."
    
    # Query gateway
    result = query_ai(prompt=prompt, context="operations")
    
    # Return in expected format
    return {
        "ai_confidence": 0.85 if result["grounded"] else 0.95,
        "proposed_action": result["response"],
        "approved": False,
        "provider": result["provider"]
    }
