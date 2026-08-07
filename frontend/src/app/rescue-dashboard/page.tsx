"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RescueDashboardLayout } from "@/components/rescue/RescueDashboardLayout";

export default function RescueTeamDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["rescue", "authority", "hospital", "ngo"]}>
      <RescueDashboardLayout />
    </ProtectedRoute>
  );
}
