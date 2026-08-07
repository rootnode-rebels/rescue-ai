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
  Activity,
  Trash2,
  AlertTriangle,
  Users,
} from "lucide-react";
import { UserRole, UserProfile, SOSFirestoreRequest } from "@/types/auth";
import {
  subscribeLiveSOSQueue,
  deleteSOSRequestInFirestore,
} from "@/services/sosService";
import {
  provisionUserAccountBySuperAdmin,
  subscribeAllUsers,
  updateUserRoleInFirestore,
} from "@/services/authService";

export default function AdminDashboardPage() {
  const { userProfile } = useAuth();
  const [role, setRole] = useState<UserRole>("rescue_admin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allSOS, setAllSOS] = useState<SOSFirestoreRequest[]>([]);

  // Real-time Firestore users & SOS subscriptions
  useEffect(() => {
    const unsubSOS = subscribeLiveSOSQueue((list) => {
      setAllSOS(list);
    });

    const unsubUsers = subscribeAllUsers((usersList) => {
      setAllUsers(usersList);
    });

    return () => {
      unsubSOS();
      unsubUsers();
    };
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const created = await provisionUserAccountBySuperAdmin({
        name,
        email,
        phone,
        password,
        role,
        organization,
        badgeNumber,
      });

      // Dispatch Resend email notification
      try {
        await fetch("/api/send-reset-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: created.name,
            email: created.email,
            role: created.role,
            tempPassword: password,
            actionType: "provision",
          }),
        });
      } catch (emailErr) {
        console.warn("Resend API email notice:", emailErr);
      }

      setSuccessMsg(
        `Account for "${created.name}" (${created.role.toUpperCase()}) provisioned successfully! Credentials and email notice dispatched to user's inbox (${created.email}).`
      );
      setName("");
      setEmail("");
      setPhone("");
      setOrganization("");
      setBadgeNumber("");
      setPassword("");
    } catch (err: unknown) {
      console.error("Account provisioning error:", err);
      const msg = err instanceof Error ? err.message : "Failed to provision user account. Make sure password is at least 6 chars.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    try {
      await updateUserRoleInFirestore(uid, newRole);
      setSuccessMsg(`Role for user UID ${uid.slice(0, 6)} updated to "${newRole.toUpperCase()}"!`);
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleDeleteFakeSOS = async (requestId: string) => {
    await deleteSOSRequestInFirestore(requestId);
    setSuccessMsg(`Spam SOS ${requestId} purged from Firestore.`);
  };

  return (
    <ProtectedRoute allowedRoles={["global_admin"]}>
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
                Super Admin Account Provisioning, Real-time Role Assignment &amp; Live Firestore Purge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-2xl border border-slate-700 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Super Admin Rights ({userProfile?.name || "Global Authority"})</span>
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
                  <span>Cloud Firestore Authority Control Center</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono rounded-md">
                    ONLINE
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  All accounts log in through the same <strong className="text-white">/login</strong> page and get routed based on their Firestore document role.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
                Registered Users: <strong className="text-emerald-400">{allUsers.length} TOTAL</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300">
                Active SOS Requests: <strong className="text-red-400">{allSOS.length} LIVE</strong>
              </div>
            </div>
          </div>

          {/* Feedback Alerts */}
          {successMsg && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 rounded-2xl text-xs font-bold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 2 Column Layout: Provisioning Tool & User Directory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (6 cols): Provision Account Tool */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-red-500" />
                  <span>Provision Account (Super Admin Tool)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Create verified <strong className="text-slate-200">Rescue Admin</strong>, <strong className="text-slate-200">Global Admin</strong>, or <strong className="text-slate-200">Citizen</strong> credentials. All users log in via <span className="font-mono text-red-400">/login</span>.
                </p>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                {/* Select Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "rescue_admin", title: "Rescue Admin", icon: Ambulance },
                      { id: "global_admin", title: "Global Admin", icon: ShieldCheck },
                      { id: "citizen", title: "Citizen", icon: User },
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Commander Sarah Vance"
                      className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Account Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="officer@rescueai.gov"
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
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                        placeholder="BADGE-CG-9081"
                        className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Access Password</label>
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
                  disabled={loading}
                  className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950 transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Provisioning Firebase Credentials...</span>
                  ) : (
                    <span>Provision Account ({role.toUpperCase()})</span>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column (6 cols): Real-time User Role Management Directory */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time User Directory ({allUsers.length})</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    LIVE FIRESTORE
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Change any user&apos;s role on the fly. When they log in via <strong className="text-white">/login</strong>, they immediately receive that role&apos;s dashboard privileges.
                </p>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {allUsers.map((u) => (
                    <div key={u.uid} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <h4 className="text-xs font-black text-white">{u.name}</h4>
                          <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                        </div>

                        {/* Real-time Role Selector */}
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
                          className="bg-slate-900 text-white font-mono font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-700 focus:border-red-500 focus:outline-none"
                        >
                          <option value="citizen">citizen</option>
                          <option value="rescue_admin">rescue_admin</option>
                          <option value="global_admin">global_admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time SOS Incident Purge Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Real-Time Firestore SOS Signals (Global Purge Console)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Purge fake or spam emergency requests from Cloud Firestore with 1 click
                </p>
              </div>

              <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-800 text-xs font-bold rounded-full">
                {allSOS.length} ACTIVE DOCUMENTS
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
                      <span>Purge Spam</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
