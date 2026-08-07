import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { RegisterFormData, LoginFormData, UserProfile } from "@/types/auth";

const USERS_COLLECTION = "users";

/**
 * Fetches user profile from Firestore by UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    return null;
  }
}

/**
 * Registers a new user with Email & Password.
 * Automatically creates a Firestore user document with default role 'Citizen'.
 */
export async function registerWithEmail(data: RegisterFormData): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const user = userCredential.user;

  // Update Firebase Auth Display Name
  await updateProfile(user, { displayName: data.name });

  const now = new Date().toISOString();
  const newProfile: UserProfile = {
    uid: user.uid,
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    role: "Citizen", // Default role
    photoURL: user.photoURL || null,
    createdAt: now,
    lastLogin: now,
    status: "active",
  };

  // Create Firestore Document safely
  try {
    await setDoc(doc(db, USERS_COLLECTION, user.uid), newProfile);
  } catch (err) {
    console.warn("Firestore permission error when creating user document. Check Firestore Security Rules:", err);
  }

  return newProfile;
}

/**
 * Signs in user with Email & Password.
 * Updates lastLogin in Firestore.
 */
export async function loginWithEmail(data: LoginFormData): Promise<UserProfile> {
  const persistenceMode = data.rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistenceMode);

  const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
  const user = userCredential.user;
  const now = new Date().toISOString();

  // Fetch or update user profile
  let profile = await getUserProfile(user.uid);

  if (profile) {
    try {
      await updateDoc(doc(db, USERS_COLLECTION, user.uid), { lastLogin: now });
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
    profile.lastLogin = now;
  } else {
    // Fallback if Firestore doc was missing
    profile = {
      uid: user.uid,
      name: user.displayName || "User",
      email: user.email || data.email,
      phone: user.phoneNumber || "",
      role: "Citizen",
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

  return profile;
}

/**
 * Signs in or registers user via Google Authentication.
 * Automatically creates Firestore document with default role 'Citizen' if new user.
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;
  const now = new Date().toISOString();

  let profile = await getUserProfile(user.uid);

  if (!profile) {
    // New Google User - Create Firestore doc with default role Citizen
    profile = {
      uid: user.uid,
      name: user.displayName || "Google User",
      email: user.email || "",
      phone: user.phoneNumber || "",
      role: "Citizen",
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
    // Existing Google User - Update lastLogin
    try {
      await updateDoc(doc(db, USERS_COLLECTION, user.uid), { lastLogin: now });
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
    profile.lastLogin = now;
  }

  return profile;
}

/**
 * Logs out current authenticated user.
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Sends a password reset email.
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}
