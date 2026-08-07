export type UserRole = "citizen" | "rescue" | "authority" | "hospital" | "ngo";

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
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  role: UserRole;
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
