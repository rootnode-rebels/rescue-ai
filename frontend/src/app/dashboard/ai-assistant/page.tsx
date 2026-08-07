"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ChatLayout } from "@/components/ai-assistant/ChatLayout";

export default function DashboardAIAssistantPage() {
  return (
    <ProtectedRoute allowedRoles={["citizen", "rescue", "authority", "hospital", "ngo"]}>
      <ChatLayout />
    </ProtectedRoute>
  );
}
