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
  Clock,
  Check,
  X,
} from "lucide-react";
import { UserRole, UserProfile } from "@/types/auth";

const INITIAL_PENDING_APPLICATIONS: UserProfile[] = [
  {
    uid: "app-101",
    name: "Capt. Alan Vance",
    email: "alan.vance@coastguard.gov",
    phone: "+1 (555) 902-1144",
    role: "rescue",
    organization: "Coast Guard Air Rescue Unit 9",
    badgeNumber: "CG-AIR-9081",
    photoURL: null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "pending_approval",
  },
  {
    uid: "app-102",
    name: "Dr. Elena Rostova",
    email: "elena.rostova@centralhospital.org",
    phone: "+1 (555) 349-2211",
    role: "hospital",
    organization: "Central Bay Trauma Center",
    badgeNumber: "HOSP-BAY-402",
    photoURL: null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "pending_approval",
  },
  {
    uid: "app-103",
    name: "Marcus Miller",
    email: "marcus@redcrossrelief.org",
    phone: "+1 (555) 882-9900",
    role: "ngo",
    organization: "Red Cross Disaster Relief Battalion",
    badgeNumber: "NGO-RC-8810",
    photoURL: null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: "pending_approval",
  },
];

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
  const [pendingApps, setPendingApps] = useState<UserProfile[]>(INITIAL_PENDING_APPLICATIONS);

  const handleCreateOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(
      `Official Account for "${name}" (${role.toUpperCase()}) provisioned & activated successfully!`
    );
    setName("");
    setEmail("");
    setPhone("");
    setOrganization("");
    setBadgeNumber("");
    setPassword("");
  };

  const handleApproveApplication = (uid: string) => {
    setPendingApps((prev) => prev.filter((app) => app.uid !== uid));
    setSuccessMsg(`Official Application ${uid} APPROVED! Account activated with role access.`);
  };

  const handleRejectApplication = (uid: string) => {
    setPendingApps((prev) => prev.filter((app) => app.uid !== uid));
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
                National EOC Approval &amp; Official Responder Provisioning Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-2xl border border-slate-700 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Super Admin Rights Active</span>
          </div>
        </header>

        <main className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
          {/* Security Status Banner */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Encrypted Super Admin Authorization Node</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono rounded-md">
                    VERIFIED
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full super admin privileges enabled. Review pending official registrations and dispatch nodes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
                Pending Approvals: <strong className="text-amber-400">{pendingApps.length} APPLICANTS</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
                System Health: <strong className="text-emerald-400">99.99% ONLINE</strong>
              </div>
            </div>
          </div>

          {/* Super Admin Approval Queue Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Pending Official Responder Registrations</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Rescue Teams, Volunteers, Hospitals, and NGOs requesting role access
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold rounded-full">
                {pendingApps.length} PENDING REVIEW
              </span>
            </div>

            {pendingApps.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-300">All official responder registrations have been reviewed!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pendingApps.map((app) => (
                  <div key={app.uid} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-black text-white">{app.name}</h4>
                        <p className="text-[11px] text-slate-400">{app.email}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono rounded font-bold uppercase">
                        {app.role}
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-[11px] text-slate-300 border-t border-slate-900 pt-2">
                      <p><strong className="text-slate-400">Unit:</strong> {app.organization}</p>
                      <p><strong className="text-slate-400">Badge:</strong> {app.badgeNumber}</p>
                      <p><strong className="text-slate-400">Phone:</strong> {app.phone}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleApproveApplication(app.uid)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectApplication(app.uid)}
                        className="py-2 px-3 bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2 Column Layout: Direct Provisioning Form & Role Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Create Official Account */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-red-500" />
                  <span>Directly Provision Official Account</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Exclusively authorized for Super Admins to add Rescue Officers, Authorities, Hospitals, and NGOs.
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
                  Provision &amp; Activate Credentials
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
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
