# Simple Firestore client wrapper. Requires GOOGLE_APPLICATION_CREDENTIALS env var.
from google.cloud import firestore
db = firestore.Client()

def create_sos_document(sos_doc: dict):
    col = db.collection("sos")
    # server timestamp
    sos_doc['created_at'] = firestore.SERVER_TIMESTAMP
    sos_doc['updated_at'] = firestore.SERVER_TIMESTAMP
    doc_ref = col.document()
    sos_doc['id'] = doc_ref.id
    doc_ref.set(sos_doc)
    return sos_doc

def list_pending(limit=50):
    docs = db.collection('sos').where('status','==','pending').order_by('priority_score', direction=firestore.Query.DESCENDING).limit(limit).stream()
    return [d.to_dict() for d in docs]

def update_sos(sos_id, patch):
    ref = db.collection('sos').document(sos_id)
    ref.update({**patch, 'updated_at': firestore.SERVER_TIMESTAMP})
    return ref.get().to_dict()
