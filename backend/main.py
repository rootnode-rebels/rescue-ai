# FastAPI app: exposes minimal endpoints for SOS capture, list, accept, triage.
from fastapi import FastAPI, Request, Header, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
import triage as triage_module
from firestore_client import create_sos_document, list_pending, update_sos

# Optional Firebase Admin for token validation
try:
    import firebase_admin
    from firebase_admin import auth as fb_auth, credentials
    if not firebase_admin._apps:
        cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        if cred_path:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
except Exception as e:
    print("Firebase admin not configured:", e)
    firebase_admin = None

app = FastAPI(title="RescueAI Backend")

class SOSCreate(BaseModel):
    local_id: Optional[str]
    user_id: Optional[str]
    device_id: Optional[str]
    description: Optional[str]
    structured_fields: Optional[dict] = {}
    location: Optional[dict] = {}
    created_at: Optional[str]

@app.post("/api/v1/sos")
async def create_sos(payload: SOSCreate, authorization: Optional[str] = Header(None)):
    # optional token validation
    if authorization and firebase_admin:
        token = authorization.split('Bearer ')[-1] if 'Bearer' in authorization else authorization
        try:
            decoded = fb_auth.verify_id_token(token)
            payload.user_id = decoded.get('uid')
        except Exception as e:
            # invalid token -> continue as guest for demo, but log
            print("Token verify failed:", e)

    # run triage sync (deterministic)
    score,label,conf,reasons = triage_module.triage_score(payload.dict())
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
    return {"ok": True, "sos_id": created['id'], "priority_score": score, "priority_label": label, "confidence": conf, "reasons": reasons}

@app.get("/api/v1/sos")
async def get_pending(status: str = "pending", limit: int = 50):
    docs = list_pending(limit=limit)
    # convert timestamps to iso if needed
    return docs

@app.patch("/api/v1/sos/{sos_id}/accept")
async def accept_sos(sos_id: str, payload: dict):
    updated = update_sos(sos_id, {'status': 'in_progress', 'assigned_team_id': payload.get('team_id','demo')})
    return updated

@app.patch("/api/v1/sos/{sos_id}/override_priority")
async def override_priority(sos_id: str, payload: dict):
    # payload: new_priority_label, new_priority_score, officer_id, reason
    patch = {
        'priority_label': payload.get('new_priority_label'),
        'priority_score': payload.get('new_priority_score'),
        'override_reason': payload.get('reason'),
        'overridden_by': payload.get('officer_id')
    }
    updated = update_sos(sos_id, patch)
    # write an audit record in Firestore audits collection could be added here
    return updated

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT",8000)), reload=True)
