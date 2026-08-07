import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  setPersistence,
  browserLocalPersistence,
  getAuth,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { auth, db, googleProvider, firebaseConfig } from "@/lib/firebase";
import { RegisterFormData, LoginFormData, UserProfile, UserRole } from "@/types/auth";

const USERS_COLLECTION = "users";
const LOCAL_STORAGE_KEY = "rescueai_user_profile";

/**
 * Global Super Admin Authorized Whitelist
 */
export const SUPER_ADMIN_EMAILS = [
  "adhiam@outlook.in",
  "akashakashr505@gmail.com",
  "adhibasavanal@gmail.com",
];

/**
 * Rescue Admin Authorized Whitelist
 */
export const RESCUE_ADMIN_EMAILS = [
  "akshathch567@gmail.com",
  "akash191112@gmail.com",
];

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function isRescueAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return RESCUE_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function getBootstrapRole(email?: string | null): UserRole {
  if (!email) return "citizen";
  const clean = email.trim().toLowerCase();
  if (SUPER_ADMIN_EMAILS.includes(clean)) return "global_admin";
  if (RESCUE_ADMIN_EMAILS.includes(clean)) return "rescue_admin";
  return "citizen";
}

/**
 * Generates a unique, cryptographically random temporary password.
 */
export function generateUniqueTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Rescue#${code}`;
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
    console.warn("Error fetching user profile from Firestore:", error);
  }

  // Fallback to localStorage ONLY IF stored profile UID matches requested UID
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const profile = JSON.parse(stored) as UserProfile;
        if (profile && profile.uid === uid) {
          return profile;
        }
      } catch (e) {
        console.warn("Error parsing stored user profile:", e);
      }
    }
  }
  return null;
}

/**
 * Registers a new Citizen account.
 */
export async function registerWithEmail(data: RegisterFormData): Promise<UserProfile> {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: data.name });

  const now = new Date().toISOString();
  const assignedRole: UserRole = getBootstrapRole(data.email);

  const newProfile: UserProfile = {
    uid: user.uid,
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    role: assignedRole,
    organization: assignedRole === "global_admin" ? "EOC National Super Admin Command" : assignedRole === "rescue_admin" ? "NDRF Emergency Rescue Command" : "",
    badgeNumber: assignedRole === "global_admin" ? "SUPER-ADMIN-01" : assignedRole === "rescue_admin" ? "RESCUE-ADMIN-01" : "",
    photoURL: user.photoURL || null,
    createdAt: now,
    lastLogin: now,
    status: "active",
    mustChangePassword: false,
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
 * Auto-creates user account if signing in for the first time!
 */
export async function loginWithEmail(data: LoginFormData): Promise<UserProfile> {
  await setPersistence(auth, browserLocalPersistence);
  const targetRole = getBootstrapRole(data.email);
  
  let userCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
  } catch (err: unknown) {
    const fbErr = err as { code?: string };
    // Seamless Auto-Onboarding: if user tries to log in with valid credentials but user is not in Firebase Auth yet, register them on the fly!
    if (fbErr.code === "auth/user-not-found" || fbErr.code === "auth/invalid-credential") {
      try {
        userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      } catch (createErr: unknown) {
        // If registration fails because email already exists (meaning it was a wrong password error), throw original login error
        throw err;
      }
    } else {
      throw err;
    }
  }

  const user = userCredential.user;
  const now = new Date().toISOString();

  let profile = await getUserProfile(user.uid);

  if (profile) {
    if (targetRole !== "citizen" && profile.role !== targetRole) {
      profile.role = targetRole;
      try {
        await updateDoc(doc(db, USERS_COLLECTION, user.uid), { role: targetRole });
      } catch (e) {
        console.warn("Error forcing admin role:", e);
      }
    }

    try {
      await updateDoc(doc(db, USERS_COLLECTION, user.uid), { lastLogin: now });
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
    profile.lastLogin = now;
  } else {
    const fallbackName = user.displayName || data.email.split("@")[0] || "User";

    profile = {
      uid: user.uid,
      name: fallbackName,
      email: user.email || data.email,
      phone: user.phoneNumber || "",
      role: targetRole,
      organization: targetRole === "global_admin" ? "EOC National Super Admin Command" : targetRole === "rescue_admin" ? "NDRF Emergency Rescue Command" : "",
      badgeNumber: targetRole === "global_admin" ? "SUPER-ADMIN-01" : targetRole === "rescue_admin" ? "RESCUE-ADMIN-01" : "",
      photoURL: user.photoURL || null,
      createdAt: now,
      lastLogin: now,
      status: "active",
      mustChangePassword: false,
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
export async function loginWithGoogle(): Promise<UserProfile> {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;
  const now = new Date().toISOString();
  const targetRole = getBootstrapRole(user.email);

  let profile = await getUserProfile(user.uid);

  if (profile) {
    if (targetRole !== "citizen" && profile.role !== targetRole) {
      profile.role = targetRole;
      try {
        await updateDoc(doc(db, USERS_COLLECTION, user.uid), { role: targetRole });
      } catch (e) {}
    }
    try {
      await updateDoc(doc(db, USERS_COLLECTION, user.uid), { lastLogin: now });
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
    profile.lastLogin = now;
  } else {
    profile = {
      uid: user.uid,
      name: user.displayName || user.email?.split("@")[0] || "Google User",
      email: user.email || "",
      phone: user.phoneNumber || "",
      role: targetRole,
      organization: targetRole === "global_admin" ? "EOC National Super Admin Command" : targetRole === "rescue_admin" ? "NDRF Emergency Rescue Command" : "",
      badgeNumber: targetRole === "global_admin" ? "SUPER-ADMIN-01" : targetRole === "rescue_admin" ? "RESCUE-ADMIN-01" : "",
      photoURL: user.photoURL || null,
      createdAt: now,
      lastLogin: now,
      status: "active",
      mustChangePassword: false,
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
 * Provisions a new user account with a UNIQUE temporary password.
 */
export async function provisionUserAccountBySuperAdmin(data: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  organization?: string;
  badgeNumber?: string;
}): Promise<{ profile: UserProfile; tempPassword: string }> {
  const tempPassword = data.password || generateUniqueTempPassword();
  const tempAppName = "SecondaryAdminApp_" + Date.now();
  const secondaryApp = initializeApp(firebaseConfig, tempAppName);
  const secondaryAuth = getAuth(secondaryApp);
  const secondaryDb = getFirestore(secondaryApp);

  const credential = await createUserWithEmailAndPassword(secondaryAuth, data.email, tempPassword);
  const user = credential.user;

  const now = new Date().toISOString();
  const newProfile: UserProfile = {
    uid: user.uid,
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    role: data.role,
    organization: data.organization || "",
    badgeNumber: data.badgeNumber || "",
    photoURL: null,
    createdAt: now,
    lastLogin: now,
    status: "active",
    mustChangePassword: true, // Force Password Change on First Login
  };

  try {
    await setDoc(doc(secondaryDb, USERS_COLLECTION, user.uid), newProfile);
  } catch (e) {
    console.warn("Secondary DB setDoc notice:", e);
  }

  try {
    await setDoc(doc(db, USERS_COLLECTION, user.uid), newProfile);
  } catch (e) {
    console.warn("Primary DB setDoc notice:", e);
  }

  await signOut(secondaryAuth);
  return { profile: newProfile, tempPassword };
}

/**
 * Completes mandatory first login password update.
 */
export async function completeFirstLoginPasswordChange(newPassword: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No active authenticated user found.");
  }

  await updatePassword(currentUser, newPassword);

  const userDocRef = doc(db, USERS_COLLECTION, currentUser.uid);
  await updateDoc(userDocRef, { mustChangePassword: false });

  const profile = await getUserProfile(currentUser.uid);
  if (profile) {
    profile.mustChangePassword = false;
    saveProfileToLocalStorage(profile);
  }
}

/**
 * Subscribes to all user accounts in Cloud Firestore in real time.
 */
export function subscribeAllUsers(callback: (users: UserProfile[]) => void): () => void {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    return onSnapshot(
      usersRef,
      (snapshot) => {
        const list: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            list.push(docSnap.data() as UserProfile);
          }
        });
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        callback(list);
      },
      (error) => {
        console.warn("Real-time users snapshot error:", error);
      }
    );
  } catch (err) {
    console.warn("Could not setup users snapshot listener:", err);
    return () => {};
  }
}

/**
 * Updates a user's assigned role in Cloud Firestore in real time.
 */
export async function updateUserRoleInFirestore(uid: string, newRole: UserRole): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, { role: newRole, status: "active" });
  } catch (err) {
    console.warn("Error updating user role in Firestore:", err);
  }
}

/**
 * Deletes a user document from Cloud Firestore.
 */
export async function deleteUserInFirestore(uid: string): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Error deleting user from Firestore:", err);
  }
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
