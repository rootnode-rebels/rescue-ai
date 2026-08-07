# RescueAI (RootNode Rebels) — Hackathon MVP

Summary
- Offline-first PWA (Next.js) captures SOS, stores in IndexedDB when offline, auto-syncs to FastAPI backend when online. Backend triages (deterministic explainable algorithm) and writes to Firestore. Rescue Dashboard polls for pending SOS and shows priority with reasons and confidence.

Quick local run (dev)
1. Backend
   - Install Python 3.10+
   - cd backend
   - pip install -r requirements.txt
   - Set GOOGLE_APPLICATION_CREDENTIALS to service account JSON (for Firestore tests). For demo you may skip and run with Firestore emulator or set env as needed.
   - uvicorn main:app --reload --port 8000

2. Frontend
   - cd frontend
   - npm install
   - create .env with FIREBASE_API_KEY etc (optional)
   - npm run dev (open http://localhost:3000)

Notes
- Configure BACKEND_URL in frontend env to point to backend (e.g., http://localhost:8000).
- If you don't have Firestore, you can mock create_sos_document to persist to in-memory dict during local dev (fast adaptation).
- Add Google Maps key and component in pages/dashboard for map rendering. For judges, a static placeholder is OK but a real map increases polish.

Deployment
- Frontend: Vercel (default Next.js)
- Backend: Render or any container host (Docker/Gunicorn). Ensure GOOGLE_APPLICATION_CREDENTIALS is set and Firestore access allowed.

Demo script
1. Start backend & frontend
2. Open frontend index — click SOS while offline (devtools -> offline)
3. Re-enable network — pending SOS auto-syncs and appears on /dashboard
4. On dashboard, accept SOS to simulate workflow

Good luck! RootNode Rebels — run the simulate_events script to generate demo traffic.
