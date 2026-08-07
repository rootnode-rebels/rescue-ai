"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { TopNavbar } from "../dashboard/TopNavbar";
import { IncidentCard } from "../ui/IncidentCard";
import { StatsCard } from "../ui/StatsCard";
import { MapCard } from "../common/MapCard";
import {
  ShieldAlert,
  Ambulance,
  CheckCircle2,
  Users,
  Radio,
  Filter,
  RefreshCw,
  Building,
} from "lucide-react";
import { SOSRequest, SOSStatus } from "@/types";
import { getPendingOfflineSOS } from "@/lib/dexie-db";

const MOCK_SOS_QUEUE: SOSRequest[] = [
  {
    id: "SOS-9081",
    userId: "user-101",
    userName: "David Miller",
    userPhone: "+1 (555) 234-5678",
    category: "FLOOD",
    description: "Rising flood water trapped 4 family members on roof. Water level rising fast near river bank.",
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "1420 Market St, Sector 4, Bay Area",
    },
    priority: "CRITICAL",
    status: "PENDING",
    peopleCount: 4,
    medicalNeeds: true,
    aiSummary: "Critical flood trap. Immediate boat evacuation required. Elderly victim with asthma.",
    safetyGuidance: ["Stay on highest roof structure", "Signal with flashlight or white cloth"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "SOS-9082",
    userId: "user-102",
    userName: "Elena Rostova",
    userPhone: "+1 (555) 987-6543",
    category: "EARTHQUAKE",
    description: "Building wall collapsed blocking main exit. 2 adults trapped inside ground floor apartment.",
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      address: "850 Mission St, Bay Area",
    },
    priority: "HIGH",
    status: "PENDING",
    peopleCount: 2,
    medicalNeeds: false,
    aiSummary: "Structural collapse blocking exit. Heavy debris clearance team needed.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "SOS-9083",
    userId: "user-103",
    userName: "Marcus Vance",
    userPhone: "+1 (555) 456-7890",
    category: "FIRE",
    description: "Electrical fire in commercial warehouse basement. Smoke spreading to nearby residential block.",
    location: {
      latitude: 37.7695,
      longitude: -122.4469,
      address: "2100 Geary Blvd, Bay Area",
    },
    priority: "HIGH",
    status: "ACCEPTED",
    assignedTo: "team-4",
    assignedTeamName: "NDRF Unit 4 - Sector Fire Response",
    peopleCount: 6,
    medicalNeeds: true,
    aiSummary: "Toxic smoke hazard. Unit 4 dispatched with breathing apparatus.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const RescueDashboardLayout: React.FC = () => {
  const [requests, setRequests] = useState<SOSRequest[]>(MOCK_SOS_QUEUE);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLiveSOSQueue = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch from live FastAPI backend if online
      if (navigator.onLine) {
        const backendUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "https://rescueai-backend-3u2o.onrender.com/api";
        const res = await fetch(`${backendUrl}/sos`);
        if (res.ok) {
          const apiData = await res.json();
          if (Array.isArray(apiData) && apiData.length > 0) {
            setRequests(apiData);
            setLoading(false);
            return;
          }
        }
      }

      // 2. Fallback: load offline IndexedDB requests + mock queue
      const offlineItems = await getPendingOfflineSOS();
      if (offlineItems.length > 0) {
        const combined = [...offlineItems, ...MOCK_SOS_QUEUE];
        setRequests(combined);
      } else {
        setRequests(MOCK_SOS_QUEUE);
      }
    } catch (err) {
      console.warn("Error fetching live SOS queue:", err);
      setRequests(MOCK_SOS_QUEUE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveSOSQueue();
  }, [fetchLiveSOSQueue]);

  const handleAcceptRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "ACCEPTED" as SOSStatus,
              assignedTeamName: "Rescue Team Alpha (Dispatched)",
            }
          : req
      )
    );
  };

  const handleCompleteRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "COMPLETED" as SOSStatus,
            }
          : req
      )
    );
  };

  const filteredRequests = requests.filter((req) => {
    if (filterPriority !== "ALL" && req.priority !== filterPriority) return false;
    if (filterStatus !== "ALL" && req.status !== filterStatus) return false;
    return true;
  });

  const criticalCount = requests.filter((r) => r.priority === "CRITICAL" && r.status !== "COMPLETED").length;
  const activeCount = requests.filter((r) => r.status !== "COMPLETED").length;
  const resolvedCount = requests.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-800 text-red-400 text-xs font-black uppercase tracking-wider rounded-full mb-2">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span>FIELD COMMAND DISPATCH CENTER</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Rescue Operational Board
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Real-time incident dispatch, AI priority triage queue, and resource deployment matrix.
              </p>
            </div>

            <button
              onClick={fetchLiveSOSQueue}
              disabled={loading}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-red-500 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Updating..." : "Refresh Queue"}</span>
            </button>
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
                  <span>Priority:</span>
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

                <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
                  {["ALL", "PENDING", "ACCEPTED"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        filterStatus === s
                          ? "bg-slate-700 text-white"
                          : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {s}
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
                    <IncidentCard
                      key={req.id}
                      request={req}
                      isRescueView={true}
                      onAccept={handleAcceptRequest}
                      onComplete={handleCompleteRequest}
                    />
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
                    Incident Map &amp; Sector Grid
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                    LIVE TELEMETRY
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

                  <div>
                    <div className="flex justify-between font-semibold text-slate-300 mb-1">
                      <span>Evacuation Shelter Beds</span>
                      <span className="font-mono text-blue-400">420 / 600 Occupied</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-[70%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
