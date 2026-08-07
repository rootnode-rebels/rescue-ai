from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
from app.services.gemini_service import analyze_emergency_triage

router = APIRouter(prefix="/api/triage", tags=["AI Emergency Triage"])


class TriageRequestSchema(BaseModel):
    category: str = Field(..., description="FLOOD | FIRE | EARTHQUAKE | LANDSLIDE | MEDICAL | OTHER")
    description: str = Field(..., description="Victim's situation report")
    peopleCount: int = Field(1, ge=1, description="Number of victims")
    medicalNeeds: bool = Field(False, description="Whether injuries are present")


class TriageResponseSchema(BaseModel):
    priority: str
    aiSummary: str
    safetyGuidance: List[str]
    isAIGenerated: bool


@router.post("/analyze", response_model=TriageResponseSchema)
async def analyze_triage_endpoint(payload: TriageRequestSchema):
    """
    Direct endpoint for Gemini AI Emergency Triage.
    Returns AI Priority Classification (CRITICAL|HIGH|MEDIUM|LOW), Executive Summary, and Safety Guidance.
    """
    result = await analyze_emergency_triage(
        payload.category, payload.description, payload.medicalNeeds, payload.peopleCount
    )
    return result
