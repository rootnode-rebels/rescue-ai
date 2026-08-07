"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import {
  Ambulance,
  CheckCircle2,
  Users,
  Radio,
  Navigation,
  Flame,
  MapPin,
  Compass,
  AlertTriangle,
  Send,
  Shield,
  Activity,
} from "lucide-react";
import {
  subscribeLiveSOSQueue,
  updateSOSStatusInFirestore,
} from "@/services/sosService";
import { SOSFirestoreRequest, SOSStatus } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

export const RescueDashboardLayout: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const [requests, setRequests] = useState<SOSFirestoreRequest[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("");
  const [activeSOSForMap, setActiveSOSForMap] = useState<SOSFirestoreRequest | null>(null);

  // Selected squad assignment per request ID
  const [squadAssignments, setSquadAssignments] = useState<Record<string, string>>({});
  // Resolution log note per request ID
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});

  // Rescue Base Coordinates (India Command Grid)
  const baseLat = 12.9716;
  const baseLng = 77.5946;

  // Real-time Firestore Queue Subscription (Dual Collection Stream)
  useEffect(() => {
    const unsubscribe = subscribeLiveSOSQueue((liveList) => {
      setRequests(liveList);
      setLastSyncedTime(new Date().toLocaleTimeString());
      if (liveList && liveList.length > 0) {
        setActiveSOSForMap((prev) => prev || liveList[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatusAndSquad = async (requestId: string, targetStatus: SOSStatus) => {
    const assignedSquad = squadAssignments[requestId] || "Coast Guard Rescue Alpha";
    await updateSOSStatusInFirestore(requestId, targetStatus, assignedSquad);
  };

  // Calculate distance from rescue base
  const getDistanceMiles = (lat: number, lng: number) => {
    const dLat = (lat - baseLat) * 69;
    const dLng = (lng - baseLng) * 54.6;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    return dist < 0.1 ? "0.2 mi" : `${dist.toFixed(1)} mi`;
  };

  const filteredRequests = requests.filter((r) => {
    if (filterPriority === "ALL") return true;
    return r.priority === filterPriority;
  });

  const criticalCount = requests.filter((r) => r.priority === "CRITICAL").length;
  const inProgressCount = requests.filter((r) => r.status === "Accepted" || r.status === "Team On The Way" || r.status === "In Progress").length;
  const resolvedCount = requests.filter((r) => r.status === "Resolved" || r.status === "Completed").length;

  const availableSquads = [
    "Coast Guard Rescue Alpha",
    "NDRF Tactical Squad 01",
    "NDRF Tactical Squad 02",
    "Paramedic Emergency Unit #1",
    "Air Rescue Helo #4",
    "Fire & Disaster Unit 08",
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans overflow-x-hidden">
      {/* Permanent Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeView="rescue-dashboard" onSelectView={() => {}} />
      </div>

      {/* Main Tactical Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <div className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 border border-red-500/30 text-red-500 rounded-xl animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>NDRF Rescue Command Operations Console</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-[10px] rounded-full">
                  RESCUE OPERATOR ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Live Telemetry &amp; Incident Triage Stream • Synced at {lastSyncedTime || "Just Now"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Base Grid: 12.97° N, 77.59° E</span>
            </div>
            <button
              onClick={() => logout()}
              className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/60 rounded-xl text-xs font-extrabold transition-all"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Dashboard Main View Area */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Tactical Stats Header */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{criticalCount}</p>
                <p className="text-xs text-slate-400 font-semibold">Critical Priority SOS</p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
                <Ambulance className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{inProgressCount}</p>
                <p className="text-xs text-slate-400 font-semibold">Squads En Route</p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{resolvedCount}</p>
                <p className="text-xs text-slate-400 font-semibold">Resolved Rescues</p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{requests.length}</p>
                <p className="text-xs text-slate-400 font-semibold">Total Grid Incidents</p>
              </div>
            </div>
          </div>

          {/* Priority Filters */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((prio) => (
                <button
                  key={prio}
                  onClick={() => setFilterPriority(prio)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterPriority === prio
                      ? "bg-red-600 text-white shadow-md shadow-red-950"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Streaming {filteredRequests.length} Verified Grid Incidents
            </span>
          </div>

          {/* Incidents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Queue List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="p-12 text-center bg-slate-950/60 border border-slate-800 rounded-3xl text-slate-500 text-xs font-mono">
                  No active incidents matching selected priority filter.
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const dist = getDistanceMiles(req.latitude, req.longitude);
                  const selectedSquad = squadAssignments[req.requestId] || req.assignedTeamName || availableSquads[0];

                  return (
                    <div
                      key={req.requestId}
                      onClick={() => setActiveSOSForMap(req)}
                      className={`p-5 bg-slate-950/90 border rounded-3xl space-y-4 transition-all duration-200 cursor-pointer ${
                        activeSOSForMap?.requestId === req.requestId
                          ? "border-red-500 ring-2 ring-red-500/20 shadow-xl shadow-red-950/30"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30">
                            <Flame className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="text-sm font-black text-white">{req.citizenName}</h4>
                            <p className="text-[11px] text-slate-400 font-mono">{req.requestId} • Phone: {req.userPhone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 font-mono font-extrabold text-[10px] rounded-full">
                            {req.priority}
                          </span>
                          <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 font-bold text-[10px] rounded-full border border-blue-500/30">
                            {req.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        {req.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-1 text-slate-400">
                        <span className="flex items-center gap-1.5 text-red-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{req.latitude.toFixed(4)}° N, {req.longitude.toFixed(4)}° E ({dist})</span>
                        </span>
                        <span>People: <strong className="text-white">{req.peopleCount || 1}</strong> • Medical: <strong className="text-amber-400">{req.medicalNeeds ? "YES" : "NO"}</strong></span>
                      </div>

                      {/* Squad Assignment Selector */}
                      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                        <label className="block text-[11px] font-bold text-slate-400">Assign Tactical Rescue Squad</label>
                        <select
                          value={selectedSquad}
                          onChange={(e) => {
                            setSquadAssignments({
                              ...squadAssignments,
                              [req.requestId]: e.target.value,
                            });
                          }}
                          className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-red-500"
                        >
                          {availableSquads.map((sq) => (
                            <option key={sq} value={sq}>
                              {sq}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Complete Status Resolution Buttons Matrix */}
                      <div className="space-y-2 pt-1 border-t border-slate-900">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Set Incident Resolution Status</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatusAndSquad(req.requestId, "Accepted");
                            }}
                            className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] rounded-xl shadow-md transition-all uppercase"
                          >
                            Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatusAndSquad(req.requestId, "Team On The Way");
                            }}
                            className="py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[11px] rounded-xl shadow-md transition-all uppercase"
                          >
                            En Route
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatusAndSquad(req.requestId, "Reached");
                            }}
                            className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] rounded-xl shadow-md transition-all uppercase"
                          >
                            Reached
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatusAndSquad(req.requestId, "Resolved");
                            }}
                            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] rounded-xl shadow-md transition-all uppercase"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Tactical Map Telemetry Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-4 sticky top-24">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-400 animate-pulse" />
                    <h3 className="text-sm font-black text-white">Live Telemetry Map Vector</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    BEACON ACTIVE
                  </span>
                </div>

                {activeSOSForMap ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-400">Target Victim:</span>
                        <span className="font-black text-white">{activeSOSForMap.citizenName}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-400">Coordinates:</span>
                        <span className="font-bold text-red-400">
                          {activeSOSForMap.latitude.toFixed(4)}° N, {activeSOSForMap.longitude.toFixed(4)}° E
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-400">Est. Vector Distance:</span>
                        <span className="font-bold text-emerald-400">
                          {getDistanceMiles(activeSOSForMap.latitude, activeSOSForMap.longitude)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Assigned Team:</span>
                        <span className="font-bold text-blue-400">
                          {activeSOSForMap.assignedTeamName || "Unassigned"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-2xl space-y-2 text-xs text-red-300">
                      <p className="font-bold flex items-center gap-1.5">
                        <Radio className="w-4 h-4 text-red-400 animate-ping" />
                        <span>Continuous High-Frequency GPS Stream</span>
                      </p>
                      <p className="text-[11px] text-red-400/80 leading-relaxed font-mono">
                        Victim device telemetric coordinates stream automatically (&lt;20ms latency).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono">
                    Select an incident from the queue to lock tactical map vector.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
