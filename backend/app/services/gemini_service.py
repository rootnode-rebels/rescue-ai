import os
import json
import logging
from typing import Dict, Any, List

logger = logging.getLogger("RescueAI_Gemini")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def fallback_triage(category: str, description: str, medical: bool, people: int) -> Dict[str, Any]:
    """
    Robust fallback heuristic triage generator when Gemini API is unconfigured or rate limited.
    """
    desc_lower = description.lower()
    
    # Priority logic
    if medical or people >= 4 or "trapped" in desc_lower or "unconscious" in desc_lower or "severe" in desc_lower:
        priority = "CRITICAL"
    elif category in ["FIRE", "FLOOD", "EARTHQUAKE", "LANDSLIDE"] or people >= 2:
        priority = "HIGH"
    elif people > 1:
        priority = "MEDIUM"
    else:
        priority = "LOW"

    # Executive Summary
    summary = f"Emergency [{category}]: {people} person(s) affected. Medical assistance {'REQUIRED' if medical else 'not reported'}. {description[:80]}..."

    # Safety Guidance Rules by Category
    guidance_map = {
        "FLOOD": [
            "Move immediately to the highest floor or roof structure.",
            "Do not walk or drive through moving flood waters.",
            "Signal rescuers using a bright cloth, whistle, or flashlight.",
        ],
        "FIRE": [
            "Crawl low under smoke toward the nearest safe exit.",
            "Feel doors before opening; use an alternate exit if hot.",
            "Cover mouth with a damp cloth if available.",
        ],
        "EARTHQUAKE": [
            "Drop, Cover, and Hold On under a sturdy desk or table.",
            "Stay clear of glass, windows, and exterior walls.",
            "Be prepared for potential aftershocks.",
        ],
        "LANDSLIDE": [
            "Evacuate the path of debris or mudflow immediately.",
            "Curtain into a tight ball and protect your head if escape is impossible.",
        ],
        "MEDICAL": [
            "Keep the victim calm, warm, and immobile.",
            "Apply firm pressure to bleeding wounds using clean cloth.",
            "Do not administer food or drink if victim is unconscious.",
        ],
    }

    safety_rules = guidance_map.get(
        category.upper(),
        [
            "Stay calm and remain at your current location if safe.",
            "Keep emergency phone lines clear for rescue team updates.",
        ],
    )

    return {
        "priority": priority,
        "aiSummary": summary,
        "safetyGuidance": safety_rules,
        "isAIGenerated": False,
    }


async def analyze_emergency_triage(
    category: str, description: str, medical_needs: bool, people_count: int
) -> Dict[str, Any]:
    """
    Analyze emergency SOS request using Google Gemini AI.
    Returns Priority level (CRITICAL|HIGH|MEDIUM|LOW), Executive Summary, and Safety Guidance.
    """
    if not GEMINI_API_KEY:
        logger.info("GEMINI_API_KEY not set. Using heuristic fallback triage.")
        return fallback_triage(category, description, medical_needs, people_count)

    try:
        import google.generativeai as genai

        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
You are an expert Emergency Triage AI for a disaster response platform.
Analyze this emergency SOS request and return ONLY a valid JSON object matching this schema:

{{
  "priority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "aiSummary": "1-2 sentence executive triage summary for rescue commanders",
  "safetyGuidance": ["3-4 short actionable survival steps for the victim"]
}}

Emergency Context:
- Disaster Category: {category}
- Situation Description: {description}
- People Affected: {people_count}
- Immediate Medical Need: {medical_needs}

Return ONLY the raw JSON string with no markdown formatting.
"""

        response = await model.generate_content_async(prompt)
        text_content = response.text.strip()

        # Clean JSON formatting if enclosed in code block
        if text_content.startswith("```json"):
            text_content = text_content[7:]
        if text_content.endswith("```"):
            text_content = text_content[:-3]
        text_content = text_content.strip()

        data = json.loads(text_content)
        data["isAIGenerated"] = True
        return data

    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}. Falling back to heuristic triage engine.")
        return fallback_triage(category, description, medical_needs, people_count)
