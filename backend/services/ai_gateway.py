"""
StadiumMind AI — Unified AI Gateway
Central hub for all LLM requests. Handles:
  - OpenRouter multi-model fallback (DeepSeek → Qwen → Mistral → Llama → Gemma)
  - Gemini secondary cloud fallback
  - Local intelligence fallback (always available)
  - Retry logic, timeout management, usage logging
"""
import os
import time
import logging
import re
import requests
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions"
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
AI_TIMEOUT = float(os.environ.get("AI_TIMEOUT", 4.5))

OPENROUTER_MODELS = [
    os.environ.get("OPENROUTER_MODEL_PRIMARY", "deepseek/deepseek-chat"),
    os.environ.get("OPENROUTER_MODEL_SECONDARY", "qwen/qwen-2.5-72b-instruct"),
]

RETRYABLE_CODES = {500, 502, 503, 504}
QUOTA_EXCEEDED_CODES = {401, 402, 429}

# ---------------------------------------------------------------------------
# Prompt Injection Guard
# ---------------------------------------------------------------------------
_INJECTION_RE = re.compile(
    r"(ignore\s+previous|disregard|you\s+are\s+now|system:|act\s+as|jailbreak|forget\s+instructions)",
    re.IGNORECASE,
)


def sanitize(text: str) -> str:
    return _INJECTION_RE.sub("[REDACTED]", text).strip()


# ---------------------------------------------------------------------------
# OpenRouter (Primary)
# ---------------------------------------------------------------------------
def _call_openrouter(prompt: str, model: str, timeout: float = AI_TIMEOUT) -> str | None:
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "your_openrouter_api_key_here":
        return None
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://stadiummind.ai",
        "X-Title": "StadiumMind AI",
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 300,
        "temperature": 0.3,
    }
    try:
        resp = requests.post(OPENROUTER_BASE, json=payload, headers=headers, timeout=timeout)
        if resp.status_code in QUOTA_EXCEEDED_CODES:
            logger.warning("OpenRouter quota/rate limit reached (%s) — fast failover without retries", resp.status_code)
            return "QUOTA_EXCEEDED"
        if resp.status_code in RETRYABLE_CODES:
            logger.warning("OpenRouter model %s returned %s — retrying next", model, resp.status_code)
            return None
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip()
    except (requests.Timeout, requests.ConnectionError) as e:
        logger.warning("OpenRouter timeout/connection on %s: %s", model, e)
        return None
    except Exception as e:
        logger.error("OpenRouter unexpected error on %s: %s", model, e)
        return None


def _try_openrouter(prompt: str) -> str | None:
    for model in OPENROUTER_MODELS:
        result = _call_openrouter(prompt, model)
        if result == "QUOTA_EXCEEDED":
            # Do not retry additional models if API key hit rate/quota limits
            return None
        if result:
            logger.info("OpenRouter responded via %s", model)
            return result
    return None


# ---------------------------------------------------------------------------
# Gemini (Secondary)
# ---------------------------------------------------------------------------
def _try_gemini(prompt: str) -> str | None:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_google_gemini_api_key_here":
        return None
    url = f"{GEMINI_BASE}?key={GEMINI_API_KEY}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    try:
        resp = requests.post(url, json=payload, timeout=AI_TIMEOUT)
        if resp.status_code in QUOTA_EXCEEDED_CODES:
            logger.warning("Gemini quota/rate limit reached (%s) — fast failover to local engine", resp.status_code)
            return None
        if resp.status_code in RETRYABLE_CODES:
            logger.warning("Gemini returned %s", resp.status_code)
            return None
        resp.raise_for_status()
        return resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        logger.warning("Gemini failed: %s", e)
        return None


# ---------------------------------------------------------------------------
# Local Intelligence (Always Available)
# ---------------------------------------------------------------------------
LOCAL_KNOWLEDGE = {
    "gate": "Gate 4 Express Entrance is active on Concourse North with minimal wait time (< 3 mins). Gate 2 has heavy concourse flow.",
    "entrance": "Gate 4 Express Entrance is active on Concourse North with minimal wait time (< 3 mins).",
    "score": "Live Tournament Match: StadiumMind FC 2 — 1 Global Challengers (74' Played). Home victory probability: 72%.",
    "match": "Live Tournament Match: StadiumMind FC 2 — 1 Global Challengers (74' Played). Attendance: 64,500.",
    "restroom": "Family & ADA Restroom Block C (Level 2, Section 114) is fully equipped and currently reports 0 min wait time.",
    "bathroom": "Family & ADA Restroom Block C (Level 2, Section 114) is fully equipped and currently reports 0 min wait time.",
    "toilet": "Family & ADA Restroom Block C (Level 2, Section 114) is fully equipped and currently reports 0 min wait time.",
    "parking": "Smart Parking Lot B is 72% full with open ADA and EV charging bays. Shuttle departs every 4 minutes.",
    "car": "Smart Parking Lot B is 72% full with open ADA and EV charging bays. Shuttle departs every 4 minutes.",
    "food": "Concourse North Gourmet Concession is operating at 35% capacity. Express mobile order pickup is ready in < 3 mins.",
    "drink": "Concourse North Gourmet Concession is operating at 35% capacity. Express mobile order pickup is ready in < 3 mins.",
    "concession": "Concourse North Gourmet Concession is operating at 35% capacity. Express mobile order pickup is ready in < 3 mins.",
    "emergency": "First Aid Hydration & Medical Stations are active on Level 1 (Section 102). For immediate urgent help, contact vest staff.",
    "first aid": "First Aid Hydration & Medical Stations are active on Level 1 (Section 102). All staff are ADA certified.",
    "medical": "First Aid Station Level 1 is staffed with medical doctors and ADA specialists. Immediate assistance available.",
    "weather": "Current weather: 21°C Clear Skies. All concourse levels are climate-controlled.",
    "ada": "Step-free ADA elevators are active at Pillar 4 (Level 1 to Level 3). Dedicated volunteer assistance is on standby.",
    "accessible": "Step-free ADA elevators are active at Pillar 4 (Level 1 to Level 3). Dedicated volunteer assistance is on standby.",
    "wheelchair": "Step-free ADA elevators are active at Pillar 4 (Level 1 to Level 3). Dedicated volunteer assistance is on standby.",
    "shuttle": "Zero-emission electric shuttles depart North Transit Hub every 4 minutes to Lot B and Metro Station.",
    "transit": "All transit lines active. Shuttles every 4 min; Metro trains departing every 6 mins.",
    "exit": "Recommended egress: Use Express Exit Gate 4 toward Lot B or North Transit Hub (< 6 min egress time).",
    "evacuation": "Green-lit evacuation paths are active. Proceed calmly to Gate 4 or Gate 1 concourse exits.",
}

MULTILINGUAL_PREFIX = {
    "en": "",
    "es": "Para asistencia [ES] ",
    "fr": "[FR] ",
    "de": "[DE] ",
    "ar": "[AR] ",
    "zh": "[ZH] ",
    "pt": "[PT] ",
    "hi": "[HI] ",
}


def _local_response(prompt: str, language: str = "en") -> str:
    query_target = prompt.split("Question:")[-1].strip().lower() if "Question:" in prompt else prompt.lower()
    for keyword, response in LOCAL_KNOWLEDGE.items():
        if keyword in query_target:
            prefix = MULTILINGUAL_PREFIX.get(language, "")
            return f"{prefix}{response}"
    prefix = MULTILINGUAL_PREFIX.get(language, "")
    return f"{prefix}Live Championship Status: Match is LIVE (StadiumMind FC 2 — 1 Global Challengers, 74'). Express Gate 4, Smart Parking Lot B, and Level 1 Concessions are active with < 3 min wait times."


# ---------------------------------------------------------------------------
# Public Gateway Interface
# ---------------------------------------------------------------------------
def query_ai(
    prompt: str,
    context: str = "general",
    language: str = "en",
    require_live_ai: bool = False,
) -> dict:
    """
    Unified AI Gateway entry point.
    
    Returns:
        {
            "response": str,
            "provider": str,  # "openrouter", "gemini", "local"
            "model": str | None,
            "grounded": bool,
            "latency_ms": int,
            "timestamp": str,
        }
    """
    clean_prompt = sanitize(prompt)
    if not clean_prompt:
        return {
            "response": "Please provide a valid question.",
            "provider": "local",
            "model": None,
            "grounded": True,
            "latency_ms": 0,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    start = time.monotonic()

    # 1. OpenRouter (Primary)
    response = _try_openrouter(clean_prompt)
    if response:
        return _package(response, "openrouter", None, False, start)

    # 2. Gemini (Secondary)
    response = _try_gemini(clean_prompt)
    if response:
        return _package(response, "gemini", "gemini-pro", False, start)

    # 3. Local Intelligence (Always Available)
    response = _local_response(clean_prompt, language)
    return _package(response, "local", None, True, start)


def _package(response: str, provider: str, model, grounded: bool, start: float) -> dict:
    return {
        "response": response,
        "provider": provider,
        "model": model,
        "grounded": grounded,
        "latency_ms": int((time.monotonic() - start) * 1000),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
