"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { TopNavbar } from "../dashboard/TopNavbar";
import { StatsCard } from "../ui/StatsCard";
import { MapCard } from "../common/MapCard";
import { BottomMobileNav } from "../dashboard/BottomMobileNav";
import {
  ShieldAlert,
  Ambulance,
  CheckCircle2,
  Users,
  Radio,
  Filter,
  RefreshCw,
  Building,
  Zap,
  Navigation,
  Check,
  Flame,
  User,
  Phone,
  MapPin,
  Clock,
  CheckCheck,
} from "lucide-react";
import {
  subscribeLiveSOSQueue,
  updateSOSStatusInFirestore,
} from "@/services/sosService";
import { SOSFirestoreRequest, SOSStatus } from "@/types/auth";

const MOCK_FALLBACK_QUEUE: SOSFirestoreRequest[] = [
  {
    requestId: "SOS-9081",
    uid: "user-101",
    citizenName: "David Miller",
    userPhone: "+1 (555) 234-5678",
    category: "FLOOD",
    description: "Rising flood water trapped 4 family members on roof. Water level rising fast near river bank.",
    latitude: 37.7749,
    longitude: -122.4194,
    address: "1420 Market St, Sector 4, Bay Area",
    priority: "CRITICAL",
    status: "Pending",
    peopleCount: 4,
    medicalNeeds: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    requestId: "SOS-9082",
    uid: "user-102",
    citizenName: "Elena Rostova",
    userPhone: "+1 (555) 987-6543",
    category: "EARTHQUAKE",
    description: "Building wall collapsed blocking main exit. 2 adults trapped inside ground floor apartment.",
    latitude: 37.7833,
    longitude: -122.4167,
    address: "850 Mission St, Bay Area",
    priority: "HIGH",
    status: "Pending",
    peopleCount: 2,
    medicalNeeds: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    requestId: "SOS-9083",
    uid: "user-103",
    citizenName: "Marcus Vance",
    userPhone: "+1 (555) 456-7890",
    category: "FIRE",
    description: "Electrical fire in commercial warehouse basement. Smoke spreading to nearby residential block.",
    latitude: 37.7695,
    longitude: -122.4469,
    address: "2100 Geary Blvd, Bay Area",
    priority: "HIGH",
    status: "Accepted",
    assignedRescue: "team-4",
    assignedTeamName: "NDRF Unit 4 - Sector Fire Response",
    peopleCount: 6,
    medicalNeeds: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const RescueDashboardLayout: React.FC = () => {
  const [requests, setRequests] = useState<SOSFirestoreRequest[]>(MOCK_FALLBACK_QUEUE);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("");

  // Firestore onSnapshot() Real-time Queue Subscription
  useEffect(() => {
    const unsubscribe = subscribeLiveSOSQueue((liveList) => {
      if (liveList && liveList.length > 0) {
        setRequests(liveList);
      } else {
        setRequests(MOCK_FALLBACK_QUEUE);
      }
      setLastSyncedTime(new Date().toLocaleTimeString());
    });

    return () => unsubscribe();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    await updateSOSStatusInFirestore(requestId, "Accepted", "Coast Guard Rescue Alpha");
  };

  const handleCompleteRequest = async (requestId: string) => {
    await updateSOSStatusInFirestore(requestId, "Completed");
  };

  const handleNavigate = (lat: number, lng: number) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
  };

  const filteredRequests = requests.filter((req) => {
    if (filterPriority !== "ALL" && req.priority !== filterPriority) return false;
    if (filterStatus !== "ALL" && req.status !== filterStatus) return false;
    return true;
  });

  const criticalCount = requests.filter((r) => r.priority === "CRITICAL" && r.status !== "Completed").length;
  const activeCount = requests.filter((r) => r.status !== "Completed").length;
  const resolvedCount = requests.filter((r) => r.status === "Completed").length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white pb-16 lg:pb-0">
      {/* Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Operational Main Content */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-800 text-red-400 text-xs font-black uppercase tracking-wider rounded-full">
                  <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>FIELD COMMAND DISPATCH CENTER</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold rounded-full">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span>FIRESTORE ONSNAPSHOT REAL-TIME FEED</span>
                  {lastSyncedTime && <span className="text-slate-400">• {lastSyncedTime}</span>}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Rescue Operational Board
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Real-time incident dispatch, live map markers, and Firestore status sync.
              </p>
            </div>
          </div>

          {/* Operational Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="CRITICAL EMERGENCIES"
              value={criticalCount}
              subtitle="Requires immediate dispatch"
              icon={ShieldAlert}
              variant="emergency"
            />
            <StatsCard
              title="ACTIVE DISPATCHES"
              value={activeCount}
              subtitle="Units in field operation"
              icon={Ambulance}
              variant="warning"
            />
            <StatsCard
              title="RESOLVED INCIDENTS"
              value={resolvedCount}
              subtitle="Successfully rescued"
              icon={CheckCircle2}
              variant="success"
            />
            <StatsCard
              title="DEPLOYED PERSONNEL"
              value="48 Officers"
              subtitle="Across 6 response sectors"
              icon={Users}
              variant="info"
            />
          </div>

          {/* 2-Column Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Main SOS Triage Queue (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Queue Controls & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Filter className="w-4 h-4 text-red-500" />
                  <span>Priority Filter:</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        filterPriority === p
                          ? "bg-red-600 text-white shadow-md shadow-red-950"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Triage Queue Incident Cards */}
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800">
                    <p className="text-sm font-semibold text-slate-400">
                      No active emergency requests matching current filter.
                    </p>
                  </div>
                ) : (
                  filteredRequests.map((req) => (
                    <div
                      key={req.requestId}
                      className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl hover:border-slate-700 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30">
                            <Flame className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-white flex items-center gap-2">
                              <span>{req.citizenName}</span>
                              <span className="text-xs font-mono font-normal text-slate-400">
                                ({req.requestId})
                              </span>
                            </h4>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-emerald-400" />
                              <span>{req.userPhone}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-red-600 text-white font-black text-[10px] uppercase rounded-full">
                            {req.priority}
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 font-mono font-bold text-[10px] uppercase rounded-full border border-slate-700">
                            {req.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {req.description}
                      </p>

                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-red-400" />
                          <span>
                            GPS: {req.latitude.toFixed(4)}°, {req.longitude.toFixed(4)}°
                          </span>
                        </div>
                        <span className="text-slate-400">{req.peopleCount} People Affected</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {req.status === "Pending" && (
                          <button
                            onClick={() => handleAcceptRequest(req.requestId)}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all uppercase tracking-wider"
                          >
                            <Check className="w-4 h-4" />
                            <span>Accept SOS Request</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleNavigate(req.latitude, req.longitude)}
                          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Navigation className="w-4 h-4 text-blue-400" />
                          <span>GPS Navigation</span>
                        </button>

                        {req.status !== "Completed" && (
                          <button
                            onClick={() => handleCompleteRequest(req.requestId)}
                            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                          >
                            <CheckCheck className="w-4 h-4" />
                            <span>Mark Complete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Map & Resource Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Live Incident Map */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
                    Live Incident Map &amp; Realtime Markers
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                    FIRESTORE LIVE
                  </span>
                </div>
                <MapCard height="h-72" />
              </div>

              {/* Resource Capacity Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Building className="w-4 h-4 text-red-500" />
                  <span>Regional Capacity Monitor</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-300 mb-1">
                      <span>Central Hospital ICU Beds</span>
                      <span className="font-mono text-emerald-400">18 / 25 Available</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[72%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-300 mb-1">
                      <span>NDRF Evacuation Boats</span>
                      <span className="font-mono text-amber-400">4 / 10 Deployed</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full w-[40%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Fixed Bottom Touch Navigation Bar */}
      <BottomMobileNav />
    </div>
  );
};
