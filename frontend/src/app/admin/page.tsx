"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleSidebar } from "@/components/navigation/RoleSidebar";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboardPage() {
  const { userProfile } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["Administrator"]}>
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <RoleSidebar />
        <main className="flex-1 p-8">
          <header className="mb-8 border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-extrabold text-red-500">System Administration Console</h1>
            <p className="text-sm text-slate-400 mt-1">
              Administrator: <span className="font-semibold text-slate-200">{userProfile?.name}</span> ({userProfile?.email})
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <span className="text-2xl">⚙️</span>
              <h3 className="text-lg font-bold mt-2">Platform Control</h3>
              <p className="text-xs text-slate-400 mt-1">System Health: Normal</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <span className="text-2xl">👥</span>
              <h3 className="text-lg font-bold mt-2">User & Role Management</h3>
              <p className="text-xs text-slate-400 mt-1">Active Roles: Citizen, Rescue Team, Admin</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-lg font-bold mt-2">Admin Privilege</h3>
              <p className="text-xs text-red-400 font-semibold mt-1">{userProfile?.role}</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
