from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.sos import router as sos_router
from app.routers.shelters import router as shelters_router
from app.routers.triage import router as triage_router

app = FastAPI(
    title="RescueAI API Engine",
    description="Offline-First AI-Powered Disaster Response & Emergency Coordination Engine for IEEE Hack Genesis 2026",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware for Frontend Access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(sos_router)
app.include_router(shelters_router)
app.include_router(triage_router)


@app.get("/", tags=["Health Check"])
async def root_health_check():
    """Health check endpoint returning system readiness and API version."""
    return {
        "status": "HEALTHY",
        "service": "RescueAI FastAPI Engine",
        "version": "1.0.0",
        "ai_engine": "Google Gemini 1.5/2.0 API + Heuristic Fallback",
        "hackathon": "IEEE Hack Genesis 2026",
    }
