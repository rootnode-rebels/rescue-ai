export type UserRole = "Citizen" | "Rescue Team" | "Administrator";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  photoURL: string | null;
  createdAt: string;
  lastLogin: string;
  status: "active" | "suspended" | "pending";
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthContextType {
  currentUser: import("firebase/auth").User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (data: LoginFormData) => Promise<UserProfile | null>;
  register: (data: RegisterFormData) => Promise<UserProfile | null>;
  loginWithGoogle: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
