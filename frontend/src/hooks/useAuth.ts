"use client";

import { useAuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/types/auth";

/**
 * Custom React hook to consume Authentication context across RescueAI app.
 */
export function useAuth(): AuthContextType {
  return useAuthContext();
}
