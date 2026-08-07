"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SOSModuleLayout } from "@/components/sos/SOSModuleLayout";

export default function DashboardSOSPage() {
  return (
    <ProtectedRoute allowedRoles={["Citizen", "Administrator", "Rescue Team"]}>
      <SOSModuleLayout />
    </ProtectedRoute>
  );
}
