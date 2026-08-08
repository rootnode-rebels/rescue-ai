"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, DocumentSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  getUserProfile,
  loginWithEmail,
  loginWithGoogle as googleLoginService,
  logoutUser,
  registerWithEmail,
  resetPassword as resetPasswordService,
  verifyLoginOTP,
  saveProfileToLocalStorage,
} from "@/services/authService";
import {
  AuthContextType,
  LoginFormData,
  RegisterFormData,
  UserProfile,
} from "@/types/auth";

const LOCAL_STORAGE_KEY = "rescueai_user_profile";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as UserProfile;
        }
      } catch (e) {}
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (user: User | null): Promise<UserProfile | null> => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
        return profile;
      }
    } else {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          try {
            const profile = JSON.parse(stored) as UserProfile;
            if (profile && profile.uid) {
              setUserProfile(profile);
              return profile;
            }
          } catch (e) {}
        }
      }
      setUserProfile(null);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setCurrentUser(user);
        if (user) {
          await fetchProfile(user);
        } else {
          // Rehydrate from localStorage if session token exists
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored) {
              try {
                const cachedProfile = JSON.parse(stored) as UserProfile;
                if (cachedProfile && cachedProfile.uid) {
                  setUserProfile(cachedProfile);
                } else {
                  setUserProfile(null);
                }
              } catch (e) {
                setUserProfile(null);
              }
            } else {
              setUserProfile(null);
            }
          }
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Firebase Auth error during initialization:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-Time Sub-Second Role & Session Listener
  useEffect(() => {
    const targetUid = userProfile?.uid || currentUser?.uid;
    const targetEmail = userProfile?.email?.toLowerCase().trim();

    if (!targetUid && !targetEmail) return;

    const unsubscribers: (() => void)[] = [];

    const handleRoleSnapshot = (snapshot: DocumentSnapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        if (data && data.role) {
          setUserProfile((prev) => {
            if (!prev) return data;
            if (prev.role !== data.role || prev.name !== data.name) {
              const merged = { ...prev, ...data };
              saveProfileToLocalStorage(merged);
              return merged;
            }
            return prev;
          });
        }
      }
    };

    if (targetUid) {
      try {
        const u1 = onSnapshot(doc(db, "users", targetUid), handleRoleSnapshot, (err) => console.warn("UID role stream:", err));
        unsubscribers.push(u1);
      } catch (e) {}
    }

    if (targetEmail) {
      try {
        const cleanDocId = "user-" + targetEmail.replace(/[^a-zA-Z0-9]/g, "_");
        const u2 = onSnapshot(doc(db, "users", cleanDocId), handleRoleSnapshot, (err) => console.warn("Email doc role stream:", err));
        unsubscribers.push(u2);
      } catch (e) {}
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [userProfile?.uid, userProfile?.email, currentUser?.uid]);

  // Safe dashboard auto-redirection on live role change
  useEffect(() => {
    if (!userProfile?.role || typeof window === "undefined") return;
    const path = window.location.pathname;
    if (path === "/admin" || path === "/rescue-dashboard" || path === "/dashboard") {
      const targetPath =
        userProfile.role === "global_admin"
          ? "/admin"
          : userProfile.role === "rescue_admin"
          ? "/rescue-dashboard"
          : "/dashboard";
      if (path !== targetPath) {
        window.location.href = targetPath;
      }
    }
  }, [userProfile?.role]);

  const login = async (data: LoginFormData): Promise<UserProfile | null> => {
    setLoading(true);
    try {
      const profile = await loginWithEmail(data);
      setUserProfile(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<UserProfile | null> => {
    setLoading(true);
    try {
      const profile = await registerWithEmail(data);
      setUserProfile(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<UserProfile | null> => {
    setLoading(true);
    try {
      const profile = await googleLoginService();
      setUserProfile(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const loginWithOTP = async (email: string, otpCode: string): Promise<UserProfile | null> => {
    setLoading(true);
    try {
      const profile = await verifyLoginOTP(email, otpCode);
      setUserProfile(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserProfile(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    await resetPasswordService(email);
  };

  const refreshProfile = async (): Promise<void> => {
    if (currentUser) {
      await fetchProfile(currentUser);
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithOTP,
    logout,
    resetPassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
