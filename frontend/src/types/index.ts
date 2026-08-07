export type UserRole = 'citizen' | 'rescue_admin' | 'global_admin' | 'rescue' | 'authority' | 'hospital' | 'ngo';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  organization?: string;
  badgeNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type SOSStatus = 'Pending' | 'Accepted' | 'Team On The Way' | 'Reached' | 'Completed' | 'Rejected' | 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'CANCELLED';

export type EmergencyCategory = 
  | 'FLOOD' 
  | 'EARTHQUAKE' 
  | 'FIRE' 
  | 'LANDSLIDE' 
  | 'MEDICAL' 
  | 'TRAPPED'
  | 'OTHER';

export type SOSCategory = EmergencyCategory;

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
  timestamp?: number;
}

export interface SOSRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  category: EmergencyCategory;
  description: string;
  location: GeoLocation;
  priority: PriorityLevel;
  status: SOSStatus;
  peopleCount: number;
  medicalNeeds: boolean;
  assignedTo?: string;
  assignedTeamName?: string;
  aiSummary?: string;
  safetyGuidance?: string[];
  isOfflineCreated?: boolean;
  syncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  location: GeoLocation;
  capacity: number;
  currentOccupancy: number;
  contactPhone: string;
  hasMedicalSupport: boolean;
  hasFoodSupport: boolean;
  hasPowerBackup: boolean;
  status: 'OPEN' | 'FULL' | 'CLOSED';
  distanceKm?: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  isOffline?: boolean;
}

export interface SyncStatus {
  pendingCount: number;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}
