from pydantic import BaseModel, Field
from typing import List, Optional

class GeoLocationSchema(BaseModel):
    latitude: float = Field(..., description="GPS Latitude coordinate")
    longitude: float = Field(..., description="GPS Longitude coordinate")
    address: Optional[str] = Field(None, description="Formatted street address")
    accuracy: Optional[float] = Field(None, description="GPS accuracy in meters")

class SOSCreateSchema(BaseModel):
    id: Optional[str] = Field(None, description="Client generated UUID for idempotent offline syncing")
    userId: str = Field(..., description="Firebase user UID")
    userName: str = Field(..., description="Victim full name")
    userPhone: str = Field(..., description="Emergency contact phone number")
    category: str = Field(..., description="FLOOD | EARTHQUAKE | FIRE | LANDSLIDE | MEDICAL | TRAPPED | OTHER")
    description: str = Field(..., description="Detailed description of distress situation")
    location: GeoLocationSchema
    peopleCount: int = Field(1, ge=1, description="Number of trapped/affected people")
    medicalNeeds: bool = Field(False, description="Whether immediate medical aid is needed")
    isOfflineCreated: bool = Field(False, description="Flag indicating offline creation on client PWA")

class SOSResponseSchema(SOSCreateSchema):
    id: str = Field(..., description="Unique SOS request ID")
    priority: str = Field("HIGH", description="CRITICAL | HIGH | MEDIUM | LOW (AI assigned)")
    status: str = Field("PENDING", description="PENDING | ACCEPTED | IN_PROGRESS | COMPLETED | CANCELLED")
    assignedTo: Optional[str] = None
    assignedTeamName: Optional[str] = None
    aiSummary: Optional[str] = None
    safetyGuidance: Optional[List[str]] = None
    syncedAt: Optional[str] = None
    createdAt: str
    updatedAt: str

class SyncBatchRequestSchema(BaseModel):
    items: List[SOSCreateSchema] = Field(..., description="List of offline SOS requests to synchronize")

class SyncBatchResponseSchema(BaseModel):
    syncedCount: int
    failedCount: int
    items: List[SOSResponseSchema]
    syncedAt: str

class ShelterSchema(BaseModel):
    id: str
    name: str
    address: str
    location: GeoLocationSchema
    capacity: int
    currentOccupancy: int
    contactPhone: str
    hasMedicalSupport: bool
    hasFoodSupport: bool
    hasPowerBackup: bool
    status: str = Field("OPEN", description="OPEN | FULL | CLOSED")
