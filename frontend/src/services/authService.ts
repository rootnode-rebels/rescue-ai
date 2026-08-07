import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { RegisterFormData, LoginFormData, UserProfile, UserRole } from "@/types/auth";

const USERS_COLLECTION = "users";
const LOCAL_STORAGE_KEY = "rescueai_user_profile";

/**
 * Super Admin Authorized Whitelist Emails
 */
export const SUPER_ADMIN_EMAILS = [
  "adhibasavanal@gmail.com",
  "akshathch567@gmail.com",
  "akash191112@gmail.com",
  "akashakashr505@gmail.com",
];

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

/**
 * Saves user profile to localStorage for persistent sessions across page reloads & app restarts.
 */
function saveProfileToLocalStorage(profile: UserProfile): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    }
  } catch (e) {
    console.warn("Could not save profile to localStorage:", e);
  }
}

/**
 * Clears user profile from localStorage upon explicit logout.
 */
function clearProfileFromLocalStorage(): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch (e) {
    console.warn("Could not clear profile from localStorage:", e);
  }
}

/**
 * Fetches user profile from Firestore by UID or fallback to localStorage.
 * Preserves stored user role (citizen, rescue_admin, global_admin).
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const profile = userSnapshot.data() as UserProfile;
      saveProfileToLocalStorage(profile);
      return profile;
    }
  } catch (error) {
    console.warn("Error fetching user profile from Firestore, using local fallback:", error);
  }

  // Fallback to localStorage if offline
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const profile = JSON.parse(stored) as UserProfile;
        return profile;
      } catch (e) {
        console.warn("Error parsing stored user profile:", e);
      }
    }
  }
  return null;
}

/**
 * Registers a new user with Email & Password.
 * Preserves selected role (citizen -> Citizen Dashboard, rescue_admin -> Rescue Dashboard).
 */
export async function registerWithEmail(data: RegisterFormData): Promise<UserProfile> {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: data.name });

  const assignedRole: UserRole = data.role || "citizen";
  const now = new Date().toISOString();

  const newProfile: UserProfile = {
    uid: user.uid,
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    role: assignedRole,
    organization: data.organization || "",
    badgeNumber: data.badgeNumber || "",
    photoURL: user.photoURL || null,
    createdAt: now,
    lastLogin: now,
    status: assignedRole === "citizen" || assignedRole === "global_admin" ? "active" : "pending_approval",
  };

  try {
    await setDoc(doc(db, USERS_COLLECTION, user.uid), newProfile);
  } catch (err) {
    console.warn("Firestore permission error when creating user document:", err);
  }

  saveProfileToLocalStorage(newProfile);
  return newProfile;
}

/**
 * Signs in user with Email & Password using browserLocalPersistence.
 */
export async function loginWithEmail(data: LoginFormData): Promise<UserProfile> {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
  const user = userCredential.user;
  const now = new Date().toISOString();

  let profile = await getUserProfile(user.uid);

  if (profile) {
    try {
      await updateDoc(doc(db, USERS_COLLECTION, user.uid), {
        lastLogin: now,
      });
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
    profile.lastLogin = now;
  } else {
    const isSuperAdmin = isSuperAdminEmail(data.email);
    profile = {
      uid: user.uid,
      name: user.displayName || "User",
      email: user.email || data.email,
      phone: user.phoneNumber || "",
      role: isSuperAdmin ? "global_admin" : "citizen",
      organization: isSuperAdmin ? "EOC National Super Admin Command" : "",
      badgeNumber: isSuperAdmin ? "SUPER-ADMIN-01" : "",
      photoURL: user.photoURL || null,
      createdAt: now,
      lastLogin: now,
      status: "active",
    };
    try {
      await setDoc(doc(db, USERS_COLLECTION, user.uid), profile);
    } catch (err) {
      console.warn("Firestore setDoc error:", err);
    }
  }

  saveProfileToLocalStorage(profile);
  return profile;
}

/**
 * Signs in or registers user via Google Authentication.
 */
export async function loginWithGoogle(requestedRole: UserRole = "citizen"): Promise<UserProfile> {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;
  const now = new Date().toISOString();

  let profile = await getUserProfile(user.uid);

  if (!profile) {
    const isSuperAdmin = isSuperAdminEmail(user.email);
    const assignedRole: UserRole = isSuperAdmin ? "global_admin" : requestedRole;
    profile = {
      uid: user.uid,
      name: user.displayName || "Google User",
      email: user.email || "",
      phone: user.phoneNumber || "",
      role: assignedRole,
      organization: isSuperAdmin ? "EOC National Super Admin Command" : "",
      badgeNumber: isSuperAdmin ? "SUPER-ADMIN-01" : "",
      photoURL: user.photoURL || null,
      createdAt: now,
      lastLogin: now,
      status: "active",
    };
    try {
      await setDoc(doc(db, USERS_COLLECTION, user.uid), profile);
    } catch (err) {
      console.warn("Firestore setDoc error:", err);
    }
  } else {
    try {
      await updateDoc(doc(db, USERS_COLLECTION, user.uid), {
        lastLogin: now,
      });
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
    profile.lastLogin = now;
  }

  saveProfileToLocalStorage(profile);
  return profile;
}

/**
 * Logs out current authenticated user and clears persistent session.
 */
export async function logoutUser(): Promise<void> {
  clearProfileFromLocalStorage();
  await signOut(auth);
}

/**
 * Sends a password reset email.
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}
