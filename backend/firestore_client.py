# Simple Firestore client wrapper. Handles environment credentials & fallbacks.
import os
from google.cloud import firestore

try:
    db = firestore.Client()
except Exception as e:
    print("Firestore client initialization warning (using local fallback mode):", e)
    db = None

def create_sos_document(sos_doc: dict):
    if not db:
        sos_doc['requestId'] = sos_doc.get('id', 'mock-id-123')
        return sos_doc

    try:
        col = db.collection("sos_requests")
        sos_doc['createdAt'] = firestore.SERVER_TIMESTAMP
        sos_doc['updatedAt'] = firestore.SERVER_TIMESTAMP
        doc_ref = col.document()
        sos_doc['requestId'] = doc_ref.id
        sos_doc['id'] = doc_ref.id
        doc_ref.set(sos_doc)

        # Mirror write to legacy collection if needed
        try:
            db.collection("sos").document(doc_ref.id).set(sos_doc)
        except Exception as e:
            print("Legacy collection mirror set notice:", e)

        return sos_doc
    except Exception as err:
        print("Error creating SOS document in Firestore:", err)
        return sos_doc

def list_pending(limit=50):
    if not db:
        return []
    try:
        docs = db.collection('sos_requests').limit(limit).stream()
        res = [d.to_dict() for d in docs]
        if not res:
            docs = db.collection('sos').limit(limit).stream()
            res = [d.to_dict() for d in docs]
        return res
    except Exception as e:
        print("Error listing pending SOS requests:", e)
        return []

def update_sos(sos_id: str, patch: dict):
    if not db:
        return {'id': sos_id, **patch}

    patch['updatedAt'] = firestore.SERVER_TIMESTAMP
    try:
        ref1 = db.collection('sos_requests').document(sos_id)
        ref1.update(patch)
    except Exception as e:
        print("Notice updating sos_requests doc:", e)

    try:
        ref2 = db.collection('sos').document(sos_id)
        ref2.update(patch)
        return ref2.get().to_dict() or {'id': sos_id, **patch}
    except Exception as e:
        print("Notice updating legacy sos doc:", e)
        return {'id': sos_id, **patch}

def get_user_role(uid: str) -> str:
    if not db:
        return "citizen"
    try:
        doc_ref = db.collection('users').document(uid)
        snap = doc_ref.get()
        if snap.exists:
            return snap.to_dict().get('role', 'citizen')
    except Exception as e:
        print("Error getting user role from Firestore:", e)
    return "citizen"

def set_user_role(uid: str, role: str) -> bool:
    if not db:
        return False
    try:
        doc_ref = db.collection('users').document(uid)
        doc_ref.update({'role': role, 'status': 'active'})
        return True
    except Exception as e:
        print("Error setting user role in Firestore:", e)
        return False
