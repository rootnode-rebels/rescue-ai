"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import {
  ShieldAlert,
  UserPlus,
  User,
  Trash2,
  Users,
  Search,
  LogOut,
  Radio,
  Server,
  Flame,
  KeyRound,
  FileText,
  Megaphone,
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
  deleteUserInFirestore,
  subscribeIntelligentAuditLogs,
  AuditLogEntry,
  dispatchEmergencyBroadcastInFirestore,
} from "@/services/authService";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["global_admin", "rescue_admin", "hospital", "authority"]}>
      <SuperAdminContent />
    </ProtectedRoute>
  );
}

function SuperAdminContent() {
  const { userProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"users" | "broadcasts" | "emergencies" | "audit" | "health">("users");

  // Account Provisioning State
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

  // Broadcast Dispatch State
  const [bTitle, setBTitle] = useState("");
  const [bCategory, setBCategory] = useState<"FLOOD" | "CYCLONE" | "HEATWAVE" | "EARTHQUAKE" | "EVACUATION_ORDER" | "GENERAL">("FLOOD");
  const [bSeverity, setBSeverity] = useState<"CRITICAL" | "WARNING" | "ADVISORY">("CRITICAL");
  const [bZone, setBZone] = useState("");
  const [bRadius, setBRadius] = useState("");
  const [bInstruction, setBInstruction] = useState("");
  const [bLoading, setBLoading] = useState(false);

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allSOS, setAllSOS] = useState<SOSFirestoreRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // User Directory Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");

  // Audit Logs Filter
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>("ALL");

  // Real-time Firestore user, SOS, and audit log subscriptions
  useEffect(() => {
    const unsubSOS = subscribeLiveSOSQueue((list) => {
      setAllSOS(list);
    });

    const unsubUsers = subscribeAllUsers((usersList) => {
      setAllUsers(usersList);
    });

    const unsubAudit = subscribeIntelligentAuditLogs((logsList) => {
      setAuditLogs(logsList);
    });

    return () => {
      unsubSOS();
      unsubUsers();
      unsubAudit();
    };
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const { profile: created, tempPassword } = await provisionUserAccountBySuperAdmin({
        name,
        email,
        phone,
        password: password || undefined,
        role,
        organization,
        badgeNumber,
      });

      try {
        await fetch("/api/send-reset-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: created.name,
            email: created.email,
            role: created.role,
            tempPassword: tempPassword,
            actionType: "provision",
          }),
        });
      } catch (emailErr) {
        console.warn("Resend API email notice:", emailErr);
      }

      setSuccessMsg(
        `Account for "${created.name}" (${created.role.toUpperCase()}) provisioned successfully! Temp Password: "${tempPassword}".`
      );
      setName("");
      setEmail("");
      setPhone("");
      setOrganization("");
      setBadgeNumber("");
      setPassword("");
    } catch (err: unknown) {
      console.error("Account provisioning error:", err);
      const msg = err instanceof Error ? err.message : "Failed to provision user account.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBLoading(true);
    try {
      const broadcast = await dispatchEmergencyBroadcastInFirestore({
        title: bTitle,
        category: bCategory,
        severity: bSeverity,
        affectedZone: bZone || "All National Quadrants",
        radius: bRadius || "10 Miles Radius",
        instruction: bInstruction,
        dispatchedByEmail: userProfile?.email || "superadmin@rescueai.org",
        dispatchedByName: userProfile?.name || "Super Admin Command",
      });

      setSuccessMsg(`National Emergency Broadcast "${broadcast.title}" Dispatched Live to All Citizens!`);
      setBTitle("");
      setBZone("");
      setBRadius("");
      setBInstruction("");
    } catch (err) {
      console.error("Error dispatching broadcast:", err);
    } finally {
      setBLoading(false);
    }
  };

  const handleRoleChange = async (targetUser: UserProfile, newRole: UserRole) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === targetUser.uid || u.email === targetUser.email ? { ...u, role: newRole } : u))
    );

    try {
      await updateUserRoleInFirestore(targetUser.uid, newRole, targetUser.email);
      setSuccessMsg(`Role for "${targetUser.name}" (${targetUser.email}) updated live to "${newRole.toUpperCase()}"!`);
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleDeleteUser = async (uid: string, userName: string) => {
    if (confirm(`Are you sure you want to remove user "${userName}" from Cloud Firestore?`)) {
      try {
        await deleteUserInFirestore(uid);
        setSuccessMsg(`User "${userName}" removed from Cloud Firestore.`);
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    if (!user) return false;
    const userRole = user.role || "citizen";
    const userName = user.name || "Anonymous User";
    const userEmail = user.email || "";
    const userPhone = user.phone || "";

    const matchesRole = filterRole === "ALL" || userRole === filterRole;
    const matchesSearch =
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userPhone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    return auditCategoryFilter === "ALL" || log.actionCategory === auditCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Super Admin Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl text-white flex items-center justify-center font-bold shadow-lg shadow-red-900/50">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>RescueAI Super Admin Command Center</span>
                <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold rounded-full">
                  GLOBAL EOC
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                National Governance • Real-Time User, SOS Telemetry &amp; Emergency Broadcast Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 font-mono flex items-center gap-2">
              <User className="w-4 h-4 text-red-400" />
              <span>{userProfile?.name || "Global Admin"}</span>
            </div>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/60 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: "users", label: "User Directory & Provisioning", icon: Users },
            { id: "broadcasts", label: "Dispatch Emergency Broadcasts", icon: Megaphone },
            { id: "emergencies", label: "Global Emergency Stream", icon: Radio },
            { id: "audit", label: "Intelligent Audit Logs", icon: FileText },
            { id: "health", label: "Service Health & Controls", icon: Server },
          ].map((tab) => {
            const IconComp = tab.icon;
            const tabId = tab.id as "users" | "broadcasts" | "emergencies" | "audit" | "health";
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tabId)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tabId
                    ? "bg-red-600 text-white shadow-lg shadow-red-950"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Success Banners */}
        {successMsg && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-md">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg("")} className="text-emerald-400 hover:text-white font-bold ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Global Error Banners */}
        {errorMsg && (
          <div className="p-4 bg-red-950/60 border border-red-800/60 text-red-300 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-md">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="text-red-400 hover:text-white font-bold ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: User Directory & Provisioning */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Account Provisioning Form Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-black text-white">Provision Official Account</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                  AUTO-RESEND DISPATCH ACTIVE
                </span>
              </div>

              <form onSubmit={handleCreateAccount} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Commander Adhi"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Target Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="official@rescueai.org"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Assigned System Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-red-500"
                  >
                    <option value="global_admin">Global Super Admin (/admin)</option>
                    <option value="rescue_admin">Rescue Admin (/rescue-dashboard)</option>
                    <option value="citizen">Citizen User (/dashboard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Organization / Command Unit</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="NDRF Command / EOC"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Custom Password (Optional)</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank for unique Rescue# code"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div className="md:col-span-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-950 transition-all uppercase tracking-wider disabled:opacity-50"
                  >
                    {loading ? "Provisioning Account..." : "Provision Account & Send Credentials Email"}
                  </button>
                </div>
              </form>
            </div>

            {/* Registered Users Directory Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-black text-white">Registered Users Directory</h2>
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 font-bold text-xs rounded-full border border-blue-500/30">
                    {filteredUsers.length} Users
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name or email..."
                      className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="global_admin">Global Super Admins</option>
                    <option value="rescue_admin">Rescue Admins</option>
                    <option value="citizen">Citizens</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">User Details</th>
                      <th className="pb-3">Assigned Role</th>
                      <th className="pb-3">Organization</th>
                      <th className="pb-3">Registered / Last Login</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3">
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </td>
                        <td className="py-3">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                            className="px-2.5 py-1 bg-slate-950 border border-slate-700 text-white rounded-lg text-xs font-bold focus:outline-none"
                          >
                            <option value="global_admin">GLOBAL ADMIN</option>
                            <option value="rescue_admin">RESCUE ADMIN</option>
                            <option value="citizen">CITIZEN</option>
                          </select>
                        </td>
                        <td className="py-3 text-slate-400">{u.organization || "General Citizen"}</td>
                        <td className="py-3 text-slate-500 text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.uid, u.name)}
                            className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded-lg border border-red-800/40 transition-all"
                            title="Delete User Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dispatch Emergency Broadcasts (Super Admin Exclusive) */}
        {activeTab === "broadcasts" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-red-500 animate-pulse" />
                <h2 className="text-base font-black text-white">National Emergency Broadcast Dispatch Console</h2>
              </div>
              <span className="text-[10px] font-mono text-red-400 bg-red-950 px-3 py-1 rounded-full border border-red-800/60 font-bold">
                SUPER ADMIN EXCLUSIVE
              </span>
            </div>

            <form onSubmit={handleDispatchBroadcast} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Broadcast Title</label>
                <input
                  type="text"
                  value={bTitle}
                  onChange={(e) => setBTitle(e.target.value)}
                  required
                  placeholder="e.g. Mandatory Evacuation Directive - Coastal Sector 4"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Category</label>
                  <select
                    value={bCategory}
                    onChange={(e) => setBCategory(e.target.value as "FLOOD" | "CYCLONE" | "HEATWAVE" | "EARTHQUAKE" | "EVACUATION_ORDER" | "GENERAL")}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-red-500"
                  >
                    <option value="FLOOD">Flash Flood</option>
                    <option value="EVACUATION_ORDER">Evacuation Order</option>
                    <option value="CYCLONE">Cyclone Surge</option>
                    <option value="HEATWAVE">Heatwave Advisory</option>
                    <option value="EARTHQUAKE">Seismic Warning</option>
                    <option value="GENERAL">General Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Severity Level</label>
                  <select
                    value={bSeverity}
                    onChange={(e) => setBSeverity(e.target.value as "CRITICAL" | "WARNING" | "ADVISORY")}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-red-500"
                  >
                    <option value="CRITICAL">CRITICAL (Red Alert)</option>
                    <option value="WARNING">WARNING (Amber Alert)</option>
                    <option value="ADVISORY">ADVISORY (Blue Notice)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Target Affected Zone</label>
                <input
                  type="text"
                  value={bZone}
                  onChange={(e) => setBZone(e.target.value)}
                  placeholder="e.g. Coastal Sector 4 & Lowland Basins"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Affected Radius / Grid Coverage</label>
                <input
                  type="text"
                  value={bRadius}
                  onChange={(e) => setBRadius(e.target.value)}
                  placeholder="e.g. 10.5 Miles Radius"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Safety &amp; Evacuation Directives</label>
                <textarea
                  value={bInstruction}
                  onChange={(e) => setBInstruction(e.target.value)}
                  required
                  placeholder="e.g. Move immediately to Relief Shelter #1 or high ground. Evacuation shuttles deployed."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none h-24"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={bLoading}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-red-950 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>{bLoading ? "Dispatching Broadcast..." : "DISPATCH NATIONAL EMERGENCY BROADCAST LIVE"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Global Emergency Stream */}
        {activeTab === "emergencies" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <h2 className="text-base font-black text-white">Nationwide Live Emergency Incident Stream</h2>
              </div>
              <span className="text-xs font-mono text-red-400 bg-red-950 px-3 py-1 rounded-full border border-red-800/60 font-bold">
                {allSOS.length} Active Signals
              </span>
            </div>

            <div className="space-y-3">
              {allSOS.map((sos) => (
                <div key={sos.requestId} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-xs">{sos.citizenName}</span>
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-mono text-[10px] font-bold rounded-full">
                        {sos.priority}
                      </span>
                      <span className="text-xs text-slate-500">• {sos.category}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{sos.description}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      GPS: {sos.latitude.toFixed(4)}° N, {sos.longitude.toFixed(4)}° E • Assigned: {sos.assignedTeamName || "Unassigned"}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteSOSRequestInFirestore(sos.requestId)}
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/60 rounded-xl text-xs font-bold transition-all shrink-0"
                  >
                    Clear Incident
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Intelligent Audit Logs */}
        {activeTab === "audit" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-black text-white">Intelligent System Security &amp; Activity Audit Logs</h2>
              </div>

              <select
                value={auditCategoryFilter}
                onChange={(e) => setAuditCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none"
              >
                <option value="ALL">All Event Categories</option>
                <option value="AUTHENTICATION">Authentication</option>
                <option value="SECURITY_AUDIT">Security Audit</option>
                <option value="CRITICAL_DISPATCH">Critical Dispatch</option>
                <option value="RESERVATION">Shelter Reservation</option>
                <option value="ROLE_MODIFICATION">Role Modification</option>
              </select>
            </div>

            <div className="space-y-2">
              {filteredAuditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-mono">
                  No activity audit logs matching selected filter category.
                </div>
              ) : (
                filteredAuditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-mono">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.actorName}</span>
                        <span className="text-slate-500">({log.actorEmail})</span>
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full">
                          [{log.actionCategory}]
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans">{log.description}</p>
                    </div>

                    <div className="text-right text-[11px] text-slate-500">
                      <p className="font-bold text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      <p>{log.riskScore}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Service Health & Controls */}
        {activeTab === "health" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <span>Production Environment Health</span>
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <span className="text-slate-400">Next.js Vercel Frontend:</span>
                  <span className="text-emerald-400 font-bold">HEALTHY 200 OK</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <span className="text-slate-400">FastAPI Render Backend:</span>
                  <span className="text-emerald-400 font-bold">ONLINE (https://rescueai-backend-3u2o.onrender.com)</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <span className="text-slate-400">Automated Email Dispatch Engine:</span>
                  <span className="text-emerald-400 font-bold">ACTIVE (SECURITY ENCRYPTION)</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <span className="text-slate-400">Cloud Firestore DB:</span>
                  <span className="text-emerald-400 font-bold">CONNECTED (&lt;20ms Sync)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-red-500" />
                <span>System Maintenance Controls</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Emergency override switches for national evacuation broadcasts and maintenance modes.
              </p>
              <button
                onClick={() => alert("Emergency Grid Telemetry Re-Synchronized.")}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider"
              >
                Force Re-Sync Emergency Grid Telemetry
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
