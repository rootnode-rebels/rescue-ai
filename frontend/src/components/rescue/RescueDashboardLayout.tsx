"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { TopNavbar } from "../dashboard/TopNavbar";
import { StatsCard } from "../ui/StatsCard";
import { BottomMobileNav } from "../dashboard/BottomMobileNav";
import {
  ShieldAlert,
  Ambulance,
  CheckCircle2,
  Users,
  Radio,
  Filter,
  Zap,
  Navigation,
  Check,
  Flame,
  Phone,
  MapPin,
  CheckCheck,
  PlusCircle,
  Clock,
  Compass,
} from "lucide-react";
import {
  subscribeLiveSOSQueue,
  updateSOSStatusInFirestore,
  createSOSRequestInFirestore,
} from "@/services/sosService";
import { SOSFirestoreRequest } from "@/types/auth";

export const RescueDashboardLayout: React.FC = () => {
  const [requests, setRequests] = useState<SOSFirestoreRequest[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("");
  const [activeSOSForMap, setActiveSOSForMap] = useState<SOSFirestoreRequest | null>(null);

  // Firestore onSnapshot() Real-time Queue Subscription
  useEffect(() => {
    const unsubscribe = subscribeLiveSOSQueue((liveList) => {
      setRequests(liveList);
      setLastSyncedTime(new Date().toLocaleTimeString());
      if (liveList && liveList.length > 0 && !activeSOSForMap) {
        setActiveSOSForMap(liveList[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    await updateSOSStatusInFirestore(requestId, "Accepted", "Coast Guard Rescue Alpha");
  };

  const handleSetStatus = async (requestId: string, status: any) => {
    await updateSOSStatusInFirestore(requestId, status, "Coast Guard Rescue Alpha");
  };

  const handleNavigate = (lat: number, lng: number) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
  };

  const handleGenerateTestSOS = async () => {
    const testId = "sos-" + Date.now();
    await createSOSRequestInFirestore({
      requestId: testId,
      citizenName: "Sarah Jenkins",
      userPhone: "+1 (555) 987-6543",
      category: "FLOOD",
      description: "Flood water trapped 3 citizens in residential sector. Need boat evacuation urgently.",
      priority: "CRITICAL",
      status: "Pending",
      latitude: 37.7749 + (Math.random() - 0.5) * 0.02,
      longitude: -122.4194 + (Math.random() - 0.5) * 0.02,
      address: "Sector 4 Emergency Flood Zone",
      peopleCount: 3,
      medicalNeeds: true,
    });
  };

  const filteredRequests = requests.filter((req) => {
    if (filterPriority !== "ALL" && req.priority !== filterPriority) return false;
    if (filterStatus !== "ALL" && req.status !== filterStatus) return false;
    return true;
  });

  const criticalCount = requests.filter((r) => r.priority === "CRITICAL" && r.status !== "Completed").length;
  const activeCount = requests.filter((r) => r.status !== "Completed").length;
  const resolvedCount = requests.filter((r) => r.status === "Completed").length;

  const currentMapLat = activeSOSForMap?.latitude || (requests.length > 0 ? requests[0].latitude : 37.7749);
  const currentMapLng = activeSOSForMap?.longitude || (requests.length > 0 ? requests[0].longitude : -122.4194);

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
                  <span>FIRESTORE REAL-TIME WEBSOCKET FEED ({requests.length} SIGNALS)</span>
                  {lastSyncedTime && <span className="text-slate-400">• SYNC {lastSyncedTime}</span>}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Rescue Operational Board
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Real-time incident dispatch, live map markers, and Firestore status sync.
              </p>
            </div>

            <button
              onClick={handleGenerateTestSOS}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-red-950 transition-all uppercase tracking-wider self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulate Citizen SOS</span>
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
                  <div className="p-8 text-center bg-slate-900/80 rounded-3xl border border-slate-800 space-y-4">
                    <Radio className="w-10 h-10 text-red-500 mx-auto animate-pulse" />
                    <div>
                      <h4 className="text-base font-black text-white">No Live SOS Signals in Firestore</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        When a citizen presses the SOS button on their dashboard, their emergency details and live GPS coordinates will appear here instantly via Cloud Firestore onSnapshot().
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateTestSOS}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create Test SOS Signal</span>
                    </button>
                  </div>
                ) : (
                  filteredRequests.map((req) => (
                    <div
                      key={req.requestId}
                      onClick={() => setActiveSOSForMap(req)}
                      className={`p-5 bg-slate-900 border rounded-3xl space-y-4 shadow-xl cursor-pointer transition-all ${
                        activeSOSForMap?.requestId === req.requestId
                          ? "border-red-500 ring-2 ring-red-500/20"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
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
                          <span className="px-2.5 py-0.5 bg-slate-800 text-amber-400 font-mono font-bold text-[10px] uppercase rounded-full border border-slate-700">
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
                          <span className="text-emerald-400 font-bold">
                            GPS Live: {req.latitude.toFixed(4)}° N, {req.longitude.toFixed(4)}° W
                          </span>
                        </div>
                        <span className="text-slate-400">{req.peopleCount} People Affected</span>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {(req.status === "Pending" || req.status === "PENDING") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptRequest(req.requestId);
                            }}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all uppercase tracking-wider"
                          >
                            <Check className="w-4 h-4" />
                            <span>1. Accept SOS</span>
                          </button>
                        )}

                        {req.status === "Accepted" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetStatus(req.requestId, "Team On The Way");
                            }}
                            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all uppercase tracking-wider"
                          >
                            <Ambulance className="w-4 h-4" />
                            <span>2. Dispatch Team En Route</span>
                          </button>
                        )}

                        {req.status === "Team On The Way" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetStatus(req.requestId, "Reached");
                            }}
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all uppercase tracking-wider"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>3. Mark Reached Site</span>
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(req.latitude, req.longitude);
                          }}
                          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Navigation className="w-4 h-4 text-blue-400" />
                          <span>Google Maps GPS</span>
                        </button>

                        {req.status !== "Completed" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetStatus(req.requestId, "Completed");
                            }}
                            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                          >
                            <CheckCheck className="w-4 h-4" />
                            <span>Mark Resolved</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Map & Telemetry Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Embedded Live Google Geospatial Emergency Map */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-red-500" />
                      <span>Live GIS Telemetry Map</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {activeSOSForMap ? `Tracking ${activeSOSForMap.citizenName}` : "Showing Sector 4 Emergency Grid"}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                    GPS TRACKED
                  </span>
                </div>

                <div className="relative h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <iframe
                    title="Live Incident Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://maps.google.com/maps?q=${currentMapLat},${currentMapLng}&z=15&output=embed`}
                    className="w-full h-full grayscale-[20%] contrast-[1.1]"
                  />

                  <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 text-xs font-mono text-slate-200 flex justify-between items-center">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {currentMapLat.toFixed(4)}°, {currentMapLng.toFixed(4)}°
                    </span>
                    <button
                      onClick={() => handleNavigate(currentMapLat, currentMapLng)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider"
                    >
                      Open Maps
                    </button>
                  </div>
                </div>
              </div>

              {/* Resource Capacity Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
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
