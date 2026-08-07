"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUserProfile,
  loginWithEmail,
  loginWithGoogle as googleLoginService,
  logoutUser,
  registerWithEmail,
  resetPassword as resetPasswordService,
} from "@/services/authService";
import {
  AuthContextType,
  LoginFormData,
  RegisterFormData,
  UserProfile,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (user: User | null) => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setCurrentUser(user);
        await fetchProfile(user);
        setLoading(false);
      },
      (error) => {
        console.warn("Firebase Auth error during initialization (Check NEXT_PUBLIC_FIREBASE_API_KEY in .env.local):", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserProfile(null);
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
