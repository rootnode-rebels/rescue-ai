from fastapi import APIRouter
from typing import List
from app.schemas.sos import ShelterSchema

router = APIRouter(prefix="/api/shelters", tags=["Evacuation Shelters"])

MOCK_SHELTERS: List[dict] = [
  {
    "id": "sh-1",
    "name": "Central High School Relief Shelter",
    "address": "450 School St, Sector 2, Bay Area",
    "location": {
      "latitude": 37.7780,
      "longitude": -122.4150,
      "address": "450 School St"
    },
    "capacity": 200,
    "currentOccupancy": 140,
    "contactPhone": "+1 (555) 019-2831",
    "hasMedicalSupport": True,
    "hasFoodSupport": True,
    "hasPowerBackup": True,
    "status": "OPEN"
  },
  {
    "id": "sh-2",
    "name": "City Sports Arena Evacuation Hub",
    "address": "1200 Stadium Way, Sector 4, Bay Area",
    "location": {
      "latitude": 37.7650,
      "longitude": -122.4300,
      "address": "1200 Stadium Way"
    },
    "capacity": 500,
    "currentOccupancy": 210,
    "contactPhone": "+1 (555) 019-2832",
    "hasMedicalSupport": True,
    "hasFoodSupport": True,
    "hasPowerBackup": True,
    "status": "OPEN"
  },
  {
    "id": "sh-3",
    "name": "Northside Community Center Shelter",
    "address": "880 North Blvd, Sector 1, Bay Area",
    "location": {
      "latitude": 37.7900,
      "longitude": -122.4050,
      "address": "880 North Blvd"
    },
    "capacity": 150,
    "currentOccupancy": 150,
    "contactPhone": "+1 (555) 019-2833",
    "hasMedicalSupport": False,
    "hasFoodSupport": True,
    "hasPowerBackup": True,
    "status": "FULL"
  }
]

@router.get("", response_model=List[ShelterSchema])
async def get_nearby_shelters():
    """Retrieve nearby evacuation shelter details and live occupancy numbers."""
    return MOCK_SHELTERS
