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
 * Super Admin Authorized Bootstrap Emails
 * Used ONLY when creating initial user documents if no document exists yet.
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
 * Saves user profile to localStorage for persistent client session cache.
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
 * Fetches user profile strictly from Firestore `users/{uid}` document.
 * NEVER alters or overwrites the stored role based on email.
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
 * Registers a new Citizen account.
 * Public users ALWAYS get role = "citizen".
 * Users can NEVER register themselves as rescue_admin or global_admin.
 */
export async function registerWithEmail(data: RegisterFormData): Promise<UserProfile> {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: data.name });

  const now = new Date().toISOString();
  // Public registration is ALWAYS citizen
  const assignedRole: UserRole = "citizen";

  const newProfile: UserProfile = {
    uid: user.uid,
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    role: assignedRole,
    organization: "",
    badgeNumber: "",
    photoURL: user.photoURL || null,
    createdAt: now,
    lastLogin: now,
    status: "active",
  };

  try {
    await setDoc(doc(db, USERS_COLLECTION, user.uid), newProfile);
  } catch (err) {
    console.warn("Firestore error when creating user document:", err);
  }

  saveProfileToLocalStorage(newProfile);
  return newProfile;
}

/**
 * Signs in user with Email & Password.
 * Reads existing profile from Firestore users/{uid} document.
 * Routes strictly based on Firestore document role.
 */
export async function loginWithEmail(data: LoginFormData): Promise<UserProfile> {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
  const user = userCredential.user;
  const now = new Date().toISOString();

  let profile = await getUserProfile(user.uid);

  if (profile) {
    // Update lastLogin timestamp without mutating the role
    try {
      await updateDoc(doc(db, USERS_COLLECTION, user.uid), {
        lastLogin: now,
      });
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
    profile.lastLogin = now;
  } else {
    // Initial document creation if missing in Firestore
    const isSuperAdmin = isSuperAdminEmail(data.email);
    const initialRole: UserRole = isSuperAdmin ? "global_admin" : "citizen";

    profile = {
      uid: user.uid,
      name: user.displayName || "User",
      email: user.email || data.email,
      phone: user.phoneNumber || "",
      role: initialRole,
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
 * Reads existing profile from Firestore users/{uid} document.
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;
  const now = new Date().toISOString();

  let profile = await getUserProfile(user.uid);

  if (!profile) {
    const isSuperAdmin = isSuperAdminEmail(user.email);
    const initialRole: UserRole = isSuperAdmin ? "global_admin" : "citizen";

    profile = {
      uid: user.uid,
      name: user.displayName || "Google User",
      email: user.email || "",
      phone: user.phoneNumber || "",
      role: initialRole,
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
 * Provisions a Rescue Admin account.
 * Allowed ONLY by Global Admin from /admin console.
 */
export async function provisionRescueAdminProfile(
  uid: string,
  name: string,
  email: string,
  phone: string,
  organization: string,
  badgeNumber: string
): Promise<UserProfile> {
  const now = new Date().toISOString();
  const profile: UserProfile = {
    uid,
    name,
    email,
    phone,
    role: "rescue_admin",
    organization,
    badgeNumber,
    photoURL: null,
    createdAt: now,
    lastLogin: now,
    status: "active",
  };

  await setDoc(doc(db, USERS_COLLECTION, uid), profile);
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
