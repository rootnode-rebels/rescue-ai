# FastAPI App Engine for RescueAI Emergency System
import os
from typing import Optional, List
from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

import triage as triage_module
from firestore_client import (
    create_sos_document,
    list_pending,
    update_sos,
    get_user_role,
    set_user_role,
)

# Optional Firebase Admin configuration
try:
    import firebase_admin
    from firebase_admin import auth as fb_auth, credentials
    if not firebase_admin._apps:
        cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
except Exception as e:
    print("Firebase admin initialized in open token mode:", e)
    firebase_admin = None

app = FastAPI(
    title="RescueAI Emergency Coordination Backend Engine",
    version="2.0.0",
    description="Real-Time FastAPI Engine for Emergency SOS Capture, Triage Scoring, and Dispatch Management",
)

# Enable CORS for Next.js Vercel Frontend and Custom Domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SOSCreate(BaseModel):
    local_id: Optional[str] = None
    user_id: Optional[str] = None
    device_id: Optional[str] = None
    description: Optional[str] = None
    structured_fields: Optional[dict] = {}
    location: Optional[dict] = {}
    created_at: Optional[str] = None

class RoleUpdate(BaseModel):
    role: str

class TriageAnalyzeRequest(BaseModel):
    description: str
    structured_fields: Optional[dict] = {}

@app.get("/")
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "RescueAI FastAPI Dispatch Engine",
        "version": "2.0.0",
        "firebase_admin_enabled": firebase_admin is not None,
    }

@app.post("/api/v1/sos")
async def create_sos(payload: SOSCreate, authorization: Optional[str] = Header(None)):
    if authorization and firebase_admin:
        token = authorization.split('Bearer ')[-1] if 'Bearer' in authorization else authorization
        try:
            decoded = fb_auth.verify_id_token(token)
            payload.user_id = decoded.get('uid')
        except Exception as e:
            print("Token verify notice:", e)

    score, label, conf, reasons = triage_module.triage_score(payload.dict())
    sos_doc = payload.dict()
    sos_doc.update({
        'status': 'pending',
        'priority_score': score,
        'priority_label': label,
        'confidence': conf,
        'reasons': reasons,
        'offline_created': False
    })
    created = create_sos_document(sos_doc)
    return {
        "ok": True,
        "sos_id": created.get('requestId') or created.get('id'),
        "priority_score": score,
        "priority_label": label,
        "confidence": conf,
        "reasons": reasons,
    }

@app.post("/api/triage/analyze")
@app.post("/api/v1/triage/analyze")
async def analyze_triage(payload: TriageAnalyzeRequest):
    score, label, conf, reasons = triage_module.triage_score({
        "description": payload.description,
        "structured_fields": payload.structured_fields
    })

    guidance: List[str] = []
    text = payload.description.lower()
    if "earthquake" in text:
        guidance = [
            "DROP onto your hands and knees to prevent falling.",
            "COVER your head and neck under a sturdy table or desk.",
            "HOLD ON to your shelter until shaking completely stops.",
            "Move away from glass, windows, and heavy unanchored items.",
        ]
    elif "fire" in text or "smoke" in text:
        guidance = [
            "Get low under smoke and crawl to the nearest exit.",
            "Feel door handles before opening — if hot, do not open.",
            "Signal for help at windows if trapped.",
            "Call Fire Department immediately at 101.",
        ]
    elif "flood" in text or "water" in text:
        guidance = [
            "Move to upper floors or rooftop immediately.",
            "Do NOT walk or drive through moving floodwaters.",
            "Signal rescue helicopters with flashlights or bright garments.",
            "Stay away from downed power lines.",
        ]
    else:
        guidance = [
            "Move to a safe, elevated location away from immediate danger.",
            "Maintain emergency communications via #112 or RescueAI portal.",
            "Keep mobile location telemetry enabled for live rescue tracking.",
        ]

    return {
        "ok": True,
        "priority": label.upper(),
        "priority_score": score,
        "category": "DISASTER EMERGENCY",
        "summary": f"Incident evaluated as {label.upper()} priority (Severity Score {score}/100).",
        "survival_guidance": guidance,
        "recommended_action": "Dispatch Nearest Response Unit & Stream Coordinates",
        "reasons": reasons,
    }

@app.get("/api/v1/sos")
async def get_pending(status: str = "pending", limit: int = 50):
    docs = list_pending(limit=limit)
    return docs

@app.patch("/api/v1/sos/{sos_id}/accept")
async def accept_sos(sos_id: str, payload: dict):
    updated = update_sos(sos_id, {'status': 'in_progress', 'assigned_team_id': payload.get('team_id', 'demo_unit_1')})
    return updated

@app.patch("/api/v1/sos/{sos_id}/override_priority")
async def override_priority(sos_id: str, payload: dict):
    patch = {
        'priority_label': payload.get('new_priority_label'),
        'priority_score': payload.get('new_priority_score'),
        'override_reason': payload.get('reason'),
        'overridden_by': payload.get('officer_id')
    }
    updated = update_sos(sos_id, patch)
    return updated

@app.get("/api/v1/users/{uid}/role")
async def fetch_role(uid: str):
    role = get_user_role(uid)
    return {"uid": uid, "role": role}

@app.patch("/api/v1/users/{uid}/role")
async def update_role(uid: str, payload: RoleUpdate):
    success = set_user_role(uid, payload.role)
    return {"uid": uid, "role": payload.role, "success": success}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)
