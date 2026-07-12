"""
StadiumMind AI — Unified AI Orchestrator (upgraded)
Conflict resolver with real timestamp and confidence scoring.
"""

from datetime import datetime, timezone

PRIORITY_MAP = {
    "EMERGENCY": 0,
    "CROWD": 1,
    "OPERATIONS": 2,
    "TRANSPORT": 3,
    "FAN": 4,
}

CONFIDENCE_BY_PRIORITY = {
    0: 0.99,
    1: 0.92,
    2: 0.85,
    3: 0.78,
    4: 0.70,
}


def resolve_ai_conflicts(domain_recommendations: list) -> dict:
    """
    Unified AI Conflict Resolver & Orchestration Logic.
    Strict Priority Hierarchy:
      P0 EMERGENCY → P1 CROWD → P2 OPERATIONS → P3 TRANSPORT → P4 FAN
    """
    if not domain_recommendations:
        return {
            "authoritative_decision": None,
            "overridden_recommendations": [],
            "confidence_score": 0.0,
            "resolution_timestamp": datetime.now(timezone.utc).isoformat(),
        }

    sorted_recs = sorted(
        domain_recommendations,
        key=lambda r: PRIORITY_MAP.get(r.get("domain", "FAN").upper(), 99),
    )

    winner = sorted_recs[0]
    priority_rank = PRIORITY_MAP.get(winner.get("domain", "FAN").upper(), 99)
    confidence = CONFIDENCE_BY_PRIORITY.get(priority_rank, 0.70)

    return {
        "authoritative_decision": winner,
        "overridden_recommendations": sorted_recs[1:],
        "confidence_score": confidence,
        "resolution_timestamp": datetime.now(timezone.utc).isoformat(),
        "priority_rank": priority_rank,
        "total_recommendations_received": len(domain_recommendations),
    }
