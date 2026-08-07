"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";

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

  useEffect(() => {
    if (!loading) {
      // 1. Not authenticated -> Redirect to /login
      if (!currentUser) {
        router.push("/login");
        return;
      }

      // 2. Role restriction check
      if (allowedRoles && allowedRoles.length > 0 && userProfile) {
        if (!allowedRoles.includes(userProfile.role)) {
          const targetDashboard = getRoleDashboard(userProfile.role);
          router.push(targetDashboard);
        }
      }
    }
  }, [currentUser, userProfile, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent shadow-lg shadow-red-500/50" />
          <p className="text-sm font-semibold text-slate-400">Authenticating RescueAI session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && userProfile && !allowedRoles.includes(userProfile.role)) {
    return null;
  }

  return <>{children}</>;
};
