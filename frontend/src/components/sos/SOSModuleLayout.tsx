"use client";

import React, { useState } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { TopNavbar } from "../dashboard/TopNavbar";
import { SOSBanner } from "./SOSBanner";
import { QuickActionCard } from "./QuickActionCard";
import { EmergencyForm } from "./EmergencyForm";
import { LocationCard } from "./LocationCard";
import { EmergencyButton } from "./EmergencyButton";
import { AIAnalysisCard } from "./AIAnalysisCard";
import { SafetyGuidanceCard } from "./SafetyGuidanceCard";
import { SecurityInfoCard } from "./SecurityInfoCard";
import { saveOfflineSOS } from "@/lib/dexie-db";
import { SOSRequest } from "@/types";
import { CheckCircle2, ShieldAlert, Sparkles, X } from "lucide-react";

export const SOSModuleLayout: React.FC = () => {
  const [description, setDescription] = useState("");
  const [emergencyType, setEmergencyType] = useState("Flood");
  const [peopleAffected, setPeopleAffected] = useState(1);
  const [activeSOS, setActiveSOS] = useState<SOSRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSendAlert = async () => {
    const sosData: SOSRequest = {
      id: "sos-" + Date.now(),
      userId: "citizen-1",
      userName: "Citizen Emergency User",
      userPhone: "+1 (555) 000-0000",
      category: emergencyType.toUpperCase() as SOSRequest["category"],
      description: description || `Emergency ${emergencyType} report filed.`,
      status: "PENDING",
      priority: "CRITICAL",
      peopleCount: peopleAffected,
      medicalNeeds: true,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: "Market St & 10th St, San Francisco, CA",
        accuracy: 8,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOfflineCreated: !navigator.onLine,
    };

    // 1. Save locally in Dexie IndexedDB for 100% offline resilience
    await saveOfflineSOS(sosData);
    setActiveSOS(sosData);
    setShowModal(true);

    // 2. Transmit to live FastAPI backend if online
    if (navigator.onLine) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "https://rescueai-backend-3u2o.onrender.com/api";
        const res = await fetch(`${backendUrl}/sos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: emergencyType.toUpperCase(),
            description: description || `Emergency ${emergencyType} alert.`,
            people_count: peopleAffected,
            latitude: 37.7749,
            longitude: -122.4194,
            address: "Market St & 10th St, San Francisco, CA",
          }),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.priority) {
            setActiveSOS((prev) => (prev ? { ...prev, priority: result.priority, status: "DISPATCHED" } : null));
          }
        }
      } catch (err) {
        console.warn("Backend transmission fallback to IndexedDB:", err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
      {/* Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <TopNavbar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Top Banner */}
          <SOSBanner />

          {/* Quick Helpline Cards */}
          <QuickActionCard />

          {/* 2-Column SOS Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Emergency Details Form & Big SOS Button */}
            <div className="lg:col-span-7 space-y-6">
              <EmergencyForm
                description={description}
                setDescription={setDescription}
                emergencyType={emergencyType}
                setEmergencyType={setEmergencyType}
                peopleAffected={peopleAffected}
                setPeopleAffected={setPeopleAffected}
              />

              <EmergencyButton onSendAlert={handleSendAlert} />
            </div>

            {/* Right Column (5 cols): Geolocation, AI Triage & Survival Tips */}
            <div className="lg:col-span-5 space-y-6">
              <LocationCard />
              <AIAnalysisCard emergencyType={emergencyType} peopleAffected={peopleAffected} />
              <SafetyGuidanceCard />
            </div>
          </div>

          {/* Bottom Security Info Card */}
          <SecurityInfoCard />
        </main>
      </div>

      {/* Confirmation Modal */}
      {showModal && activeSOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/40">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">SOS Dispatch Confirmed!</h3>
                <p className="text-xs text-slate-400">Request ID: {activeSOS.id}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Emergency Type:</span>
                <span className="font-extrabold text-red-400">{activeSOS.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">AI Priority Level:</span>
                <span className="px-2.5 py-0.5 bg-red-600 text-white rounded-md font-black">
                  {activeSOS.priority}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">People Count:</span>
                <span className="text-white font-bold">{activeSOS.peopleCount} Citizens</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sync Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {activeSOS.isOfflineCreated ? "Saved to Dexie IndexedDB" : "Live Backend Synced"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-950/40 border border-blue-800/50 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200 leading-relaxed font-sans">
                Gemini AI has dispatched your coordinates to Sector 4 Rescue Officers. Stay on high ground.
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
            >
              Acknowledge &amp; View Command Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
