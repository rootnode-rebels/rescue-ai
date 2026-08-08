"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import { ForcePasswordChangeModal } from "./ForcePasswordChangeModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const getRoleDashboard = (role?: UserRole): string => {
  switch (role) {
    case "global_admin":
      return "/admin";
    case "rescue_admin":
    case "rescue":
    case "authority":
    case "hospital":
    case "ngo":
      return "/rescue-dashboard";
    case "citizen":
    default:
      return "/dashboard";
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();

  // Support both Firebase Auth user & Local Session UserProfile
  const activeProfile =
    userProfile ||
    (typeof window !== "undefined"
      ? (() => {
          try {
            const cached = localStorage.getItem("rescueai_user_profile");
            return cached ? JSON.parse(cached) : null;
          } catch (e) {
            return null;
          }
        })()
      : null);

  const isAuthenticated = !!(currentUser || activeProfile);

  useEffect(() => {
    if (!loading) {
      // 1. Not authenticated -> Redirect to /login
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // 2. Role restriction check
      if (allowedRoles && allowedRoles.length > 0 && activeProfile) {
        if (!allowedRoles.includes(activeProfile.role)) {
          const targetDashboard = getRoleDashboard(activeProfile.role);
          router.push(targetDashboard);
        }
      }
    }
  }, [currentUser, activeProfile, loading, allowedRoles, router, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent shadow-lg shadow-red-500/50" />
          <p className="text-sm font-semibold text-slate-400">Verifying RescueAI authorization &amp; role...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && activeProfile && !allowedRoles.includes(activeProfile.role)) {
    return null;
  }

  return (
    <>
      <ForcePasswordChangeModal />
      {children}
    </>
  );
};
