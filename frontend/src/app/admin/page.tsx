"use client";

import React, { useState, useEffect } from "react";
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
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { UserRole, UserProfile, SOSFirestoreRequest } from "@/types/auth";
import {
  subscribeLiveSOSQueue,
  deleteSOSRequestInFirestore,
} from "@/services/sosService";

const INITIAL_PENDING_APPLICATIONS: UserProfile[] = [
  {
    uid: "app-101",
    name: "Capt. Alan Vance",
    email: "alan.vance@coastguard.gov",
    phone: "+1 (555) 902-1144",
    role: "rescue_admin",
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
  const [role, setRole] = useState<UserRole>("rescue_admin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pendingApps, setPendingApps] = useState<UserProfile[]>(INITIAL_PENDING_APPLICATIONS);
  const [allSOS, setAllSOS] = useState<SOSFirestoreRequest[]>([]);

  // Subscribe to real-time Firestore SOS queue
  useEffect(() => {
    const unsubscribe = subscribeLiveSOSQueue((list) => {
      setAllSOS(list);
    });
    return () => unsubscribe();
  }, []);

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
    setSuccessMsg(`Official Application ${uid} APPROVED! Credentials activated.`);
  };

  const handleRejectApplication = (uid: string) => {
    setPendingApps((prev) => prev.filter((app) => app.uid !== uid));
  };

  const handleDeleteFakeSOS = async (requestId: string) => {
    await deleteSOSRequestInFirestore(requestId);
    setSuccessMsg(`Spam SOS ${requestId} purged from Firestore.`);
  };

  return (
    <ProtectedRoute allowedRoles={["global_admin", "authority"]}>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
        {/* Header Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Global Super Admin Dashboard
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                National EOC Management, Admin Provisioning &amp; Realtime Firestore Purge Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-2xl border border-slate-700 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Global Admin Rights Active ({userProfile?.name})</span>
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
                  <span>Cloud Firestore Global Authority Node</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono rounded-md">
                    ACTIVE
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full control over user roles, rescue admin accounts, and spam SOS purges.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
                Live Firestore SOS Signals: <strong className="text-red-400">{allSOS.length} ACTIVE</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
                Pending Approvals: <strong className="text-amber-400">{pendingApps.length} APPLICANTS</strong>
              </div>
            </div>
          </div>

          {/* Real-time SOS Incident Purge Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Real-Time Firestore SOS Directory (Global Purge)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect and purge fake or spam emergency requests from Cloud Firestore
                </p>
              </div>

              <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-800 text-xs font-bold rounded-full">
                {allSOS.length} FIRESTORE DOCUMENTS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSOS.map((sos) => (
                <div key={sos.requestId} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-white">{sos.citizenName}</h4>
                      <p className="text-[11px] font-mono text-slate-400">{sos.requestId}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono font-bold rounded">
                      {sos.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">{sos.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                    <span className="text-slate-400 font-mono">Status: {sos.status}</span>
                    <button
                      onClick={() => handleDeleteFakeSOS(sos.requestId)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Fake SOS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2 Column Layout: Create Rescue Admin & System Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Create Rescue Admin Account */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-red-500" />
                  <span>Provision Rescue Admin Account</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Exclusively authorized for Global Admins to add Rescue Admins, EOC Officers, Hospitals, and NGOs.
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "rescue_admin", title: "Rescue Admin", icon: Ambulance },
                      { id: "hospital", title: "Hospital Admin", icon: Building },
                      { id: "ngo", title: "NGO Relief Admin", icon: HeartHandshake },
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
                        placeholder="rescue.admin@rescueai.gov"
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
                  Provision Rescue Admin Credentials
                </button>
              </form>
            </div>

            {/* Right Column (5 cols): Pending Registrations Queue */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Pending Official Registrations</span>
                </h3>

                {pendingApps.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">No pending official registration applications.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingApps.map((app) => (
                      <div key={app.uid} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-white">{app.name}</h4>
                            <p className="text-[10px] text-slate-400">{app.email}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 text-[9px] font-mono rounded font-bold uppercase">
                            {app.role}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handleApproveApplication(app.uid)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-md"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRejectApplication(app.uid)}
                            className="py-1.5 px-3 bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
