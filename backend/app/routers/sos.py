from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
import uuid
from datetime import datetime
from app.schemas.sos import (
    SOSCreateSchema,
    SOSResponseSchema,
    SyncBatchRequestSchema,
    SyncBatchResponseSchema,
)
from app.services.gemini_service import analyze_emergency_triage

router = APIRouter(prefix="/api/sos", tags=["SOS Emergency Requests"])

# In-memory database for hackathon demonstration
MOCK_SOS_DATABASE: List[dict] = [
    {
        "id": "SOS-9081",
        "userId": "user-101",
        "userName": "David Miller",
        "userPhone": "+1 (555) 234-5678",
        "category": "FLOOD",
        "description": "Rising flood water trapped 4 family members on roof. Water level rising fast near river bank.",
        "location": {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "address": "1420 Market St, Sector 4, Bay Area",
            "accuracy": 5.0,
        },
        "priority": "CRITICAL",
        "status": "PENDING",
        "peopleCount": 4,
        "medicalNeeds": True,
        "aiSummary": "Critical flood trap. Immediate boat evacuation required. Elderly victim with asthma.",
        "safetyGuidance": [
            "Move to highest roof structure immediately",
            "Signal rescuers with flashlight or bright white cloth",
        ],
        "isOfflineCreated": False,
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat(),
    }
]


@router.post("", response_model=SOSResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_sos_request(payload: SOSCreateSchema):
    """
    Create a new emergency SOS request.
    Invokes Gemini AI triage for priority rating, executive summary, and safety guidance.
    """
    now = datetime.utcnow().isoformat()
    request_id = payload.id or f"SOS-{uuid.uuid4().hex[:6].upper()}"

    triage_result = await analyze_emergency_triage(
        payload.category, payload.description, payload.medicalNeeds, payload.peopleCount
    )

    record = {
        "id": request_id,
        "userId": payload.userId,
        "userName": payload.userName,
        "userPhone": payload.userPhone,
        "category": payload.category,
        "description": payload.description,
        "location": payload.location.model_dump(),
        "priority": triage_result["priority"],
        "status": "PENDING",
        "peopleCount": payload.peopleCount,
        "medicalNeeds": payload.medicalNeeds,
        "aiSummary": triage_result["aiSummary"],
        "safetyGuidance": triage_result["safetyGuidance"],
        "isOfflineCreated": payload.isOfflineCreated,
        "syncedAt": now if payload.isOfflineCreated else None,
        "createdAt": now,
        "updatedAt": now,
    }

    MOCK_SOS_DATABASE.append(record)
    return record


@router.post("/sync", response_model=SyncBatchResponseSchema)
async def sync_offline_batch(payload: SyncBatchRequestSchema):
    """
    Synchronize offline emergency SOS requests stored in client Dexie IndexedDB.
    Processes items idempotently using client-generated IDs and Gemini AI triage.
    """
    synced_items = []
    now = datetime.utcnow().isoformat()

    for item in payload.items:
        triage_result = await analyze_emergency_triage(
            item.category, item.description, item.medicalNeeds, item.peopleCount
        )

        request_id = item.id or f"SOS-{uuid.uuid4().hex[:6].upper()}"

        record = {
            "id": request_id,
            "userId": item.userId,
            "userName": item.userName,
            "userPhone": item.userPhone,
            "category": item.category,
            "description": item.description,
            "location": item.location.model_dump(),
            "priority": triage_result["priority"],
            "status": "PENDING",
            "peopleCount": item.peopleCount,
            "medicalNeeds": item.medicalNeeds,
            "aiSummary": triage_result["aiSummary"],
            "safetyGuidance": triage_result["safetyGuidance"],
            "isOfflineCreated": True,
            "syncedAt": now,
            "createdAt": now,
            "updatedAt": now,
        }

        # Check for duplicates by ID
        existing = next((r for r in MOCK_SOS_DATABASE if r["id"] == request_id), None)
        if not existing:
            MOCK_SOS_DATABASE.append(record)
            synced_items.append(record)
        else:
            synced_items.append(existing)

    return {
        "syncedCount": len(synced_items),
        "failedCount": 0,
        "items": synced_items,
        "syncedAt": now,
    }


@router.get("", response_model=List[SOSResponseSchema])
async def list_sos_requests(
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
):
    """List all emergency SOS requests with optional priority and status filters."""
    result = MOCK_SOS_DATABASE
    if status:
        result = [r for r in result if r["status"].upper() == status.upper()]
    if priority:
        result = [r for r in result if r["priority"].upper() == priority.upper()]
    return result


@router.patch("/{sos_id}/status", response_model=SOSResponseSchema)
async def update_sos_status(sos_id: str, new_status: str = Query(..., description="ACCEPTED | IN_PROGRESS | COMPLETED | CANCELLED")):
    """Update emergency request status (used by Rescue Teams & Authorities)."""
    item = next((r for r in MOCK_SOS_DATABASE if r["id"] == sos_id), None)
    if not item:
        raise HTTPException(status_code=404, detail=f"SOS Request {sos_id} not found")

    item["status"] = new_status.upper()
    item["updatedAt"] = datetime.utcnow().isoformat()
    return item
