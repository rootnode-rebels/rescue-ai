"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function CitizenDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["Citizen"]}>
      <DashboardLayout />
    </ProtectedRoute>
  );
}
