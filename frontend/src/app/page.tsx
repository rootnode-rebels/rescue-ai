"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ShieldAlert, Sparkles, Lock, UserPlus } from "lucide-react";
import { getRoleDashboard } from "@/components/auth/ProtectedRoute";

export default function HomePage() {
  const { userProfile, currentUser, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  useEffect(() => {
    // If user is already logged in, automatically redirect to their dashboard
    if (!loading && (userProfile || currentUser)) {
      const role = userProfile?.role || "citizen";
      const targetDashboard = getRoleDashboard(role);
      router.replace(targetDashboard);
    }
  }, [userProfile, currentUser, loading, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Rescue<span className="text-red-500">AI</span>
            </span>
            <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-slate-400 block -mt-1">
              Disaster Response Platform
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab("login")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "login"
                ? "bg-red-600 text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "register"
                ? "bg-red-600 text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>
      </header>

      {/* Main Body: Login / Register Form Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-4xl mx-auto">
        <div className="mb-4 text-center max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-800 text-red-400 text-[11px] font-black uppercase tracking-wider rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>INSTANT DISASTER RESPONSE PORTAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome to <span className="text-red-500">RescueAI</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Sign in to access your localized emergency dashboard, send SOS distress signals, or monitor real-time AI triage operations.
          </p>
        </div>

        {/* Dynamic Active Form */}
        <div className="w-full flex justify-center">
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full py-4 border-t border-slate-900 text-center text-[11px] text-slate-500 font-medium">
        © 2026 RescueAI Disaster Coordination System. Powered by Google Gemini AI &amp; FastAPI.
      </footer>
    </div>
  );
}
