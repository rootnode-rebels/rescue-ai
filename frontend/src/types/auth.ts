export type UserRole = "citizen" | "rescue_admin" | "global_admin" | "rescue" | "authority" | "hospital" | "ngo";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organization?: string;
  badgeNumber?: string;
  photoURL: string | null;
  createdAt: string;
  lastLogin: string;
  status: "active" | "suspended" | "pending" | "pending_approval";
  mustChangePassword?: boolean;
}

export type SOSStatus =
  | "Pending"
  | "Accepted"
  | "In Progress"
  | "Resolved"
  | "Team On The Way"
  | "Reached"
  | "Completed"
  | "Rejected"
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type SOSPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface SOSLocation {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

export interface SOSFirestoreRequest {
  requestId: string;
  uid: string;
  citizenName: string;
  userPhone: string;
  category: string;
  description: string;
  priority: SOSPriority;
  status: SOSStatus;
  latitude: number;
  longitude: number;
  address: string;
  peopleCount: number;
  medicalNeeds: boolean;
  assignedRescue?: string;
  assignedTeamName?: string;
  createdAt: string;
  updatedAt: string;
  isOfflineCreated?: boolean;
}

export interface ShelterData {
  shelterId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  totalBeds: number;
  availableBeds: number;
  status: "OPEN" | "FULL" | "CLOSED";
  phone: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  role?: UserRole;
  organization?: string;
  badgeNumber?: string;
  acceptTerms?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthContextType {
  currentUser: import("firebase/auth").User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (data: LoginFormData) => Promise<UserProfile | null>;
  register: (data: RegisterFormData) => Promise<UserProfile | null>;
  loginWithGoogle: (role?: UserRole) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
