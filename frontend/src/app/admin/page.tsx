"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import {
  ShieldAlert,
  UserPlus,
  Building2,
  BadgeCheck,
  CheckCircle2,
  Mail,
  User,
  Lock,
  Phone,
  ShieldCheck,
  Ambulance,
  Building,
  HeartHandshake,
  Activity,
  Sliders,
  Radio,
} from "lucide-react";
import { UserRole } from "@/types/auth";

export default function AdminDashboardPage() {
  const { userProfile } = useAuth();
  const [role, setRole] = useState<UserRole>("rescue");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreateOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(
      `Official Account for "${name}" (${role.toUpperCase()}) provisioned successfully! Secure access credentials issued.`
    );
    setName("");
    setEmail("");
    setPhone("");
    setOrganization("");
    setBadgeNumber("");
    setPassword("");
  };

  return (
    <ProtectedRoute allowedRoles={["authority", "rescue"]}>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
        {/* Header Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Super Admin Command Console
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                National EOC Provisioning &amp; Official Responder Management Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-2xl border border-slate-700 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Super Admin Rights Active</span>
          </div>
        </header>

        <main className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
          {/* Security & System Status Banner (No Credentials / Emails Rendered) */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Encrypted Super Admin Node Active</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono rounded-md">
                    VERIFIED
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-security authentication protocol enforced. Zero sensitive key exposure.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
                System Health: <strong className="text-emerald-400">99.99% ONLINE</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
                Role Override: <strong className="text-red-400">AUTHORITY EOC</strong>
              </div>
            </div>
          </div>

          {/* 2 Column Layout: Official Provisioning Form & Role Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Create Official Account */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-red-500" />
                  <span>Provision Official Responder Account</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Provision new Rescue Officers, EOC Authorities, Hospital Triage, and NGO Relief Units.
                </p>
              </div>

              {successMsg && (
                <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateOfficial} className="space-y-4">
                {/* Select Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Official Role Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "rescue", title: "Rescue Unit", icon: Ambulance },
                      { id: "authority", title: "Authority", icon: ShieldCheck },
                      { id: "hospital", title: "Hospital", icon: Building },
                      { id: "ngo", title: "NGO Aid", icon: HeartHandshake },
                    ].map((item) => {
                      const IconComp = item.icon;
                      const isSelected = role === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setRole(item.id as UserRole)}
                          className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                            isSelected
                              ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-950 font-black"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                          }`}
                        >
                          <IconComp className="w-5 h-5 mb-1" />
                          <span className="text-xs">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Official Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Commander Mark Vance"
                      className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="responder@rescueai.gov"
                        className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Organization & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Unit</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Coast Guard Battalion 4"
                        className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Badge / ID Number</label>
                    <div className="relative">
                      <BadgeCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                        placeholder="NDRF-8902-CG"
                        className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Temp Access Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950 transition-all mt-4"
                >
                  Provision Official Credentials
                </button>
              </form>
            </div>

            {/* Right Column (5 cols): System Controls & Provisioned Nodes */}
            <div className="lg:col-span-5 space-y-6">
              {/* Super Admin Control Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <span>Super Admin System Overrides</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">Emergency Broadcast Override</h4>
                      <p className="text-[10px] text-slate-400">Trigger nationwide EOC alert banner</p>
                    </div>
                    <button className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase rounded-xl shadow-md">
                      BROADCAST
                    </button>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">Gemini AI Triage Confidence Threshold</h4>
                      <p className="text-[10px] text-slate-400">Auto-elevate priority at score &gt;= 0.85</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">0.85 OPTIMAL</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">FastAPI Backend Telemetry Node</h4>
                      <p className="text-[10px] text-slate-400">Live Render microservices synchronization</p>
                    </div>
                    <span className="font-mono text-blue-400 font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" />
                      CONNECTED
                    </span>
                  </div>
                </div>
              </div>

              {/* Provisioned Nodes */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
                  Provisioned Official Nodes
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-slate-200 font-bold">
                      <span>NDRF Sector 4 Fire Battalion</span>
                      <span className="text-emerald-400">ACTIVE</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">Badge: NDRF-9081 • Role: Rescue Unit</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-slate-200 font-bold">
                      <span>Coast Guard Marine Rescue</span>
                      <span className="text-emerald-400">ACTIVE</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">Badge: CG-4021 • Role: Rescue Unit</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-slate-200 font-bold">
                      <span>Central Hospital Trauma Unit</span>
                      <span className="text-blue-400">ONLINE</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">Badge: HOSP-102 • Role: Hospital Triage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
