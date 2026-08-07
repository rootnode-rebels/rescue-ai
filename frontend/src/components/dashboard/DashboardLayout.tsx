"use client";

import React, { useState } from "react";
import { Sidebar, DashboardViewMode } from "./Sidebar";
import { BottomMobileNav } from "./BottomMobileNav";
import { TopNavbar } from "./TopNavbar";
import { StatsCard } from "./StatsCard";
import { SOSCard } from "./SOSCard";
import { MapCard } from "./MapCard";
import { AIQuickCard } from "./AIQuickCard";
import { RequestCard } from "./RequestCard";
import { AlertCard } from "./AlertCard";
import { ShelterCard } from "./ShelterCard";
import { FooterCTA } from "./FooterCTA";
import { useAuth } from "@/hooks/useAuth";
import {
  X,
  Building,
  Bell,
  BookOpen,
  User,
  Settings,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Droplet,
} from "lucide-react";

export const DashboardLayout: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeView, setActiveView] = useState<DashboardViewMode>("dashboard");
  const [activeModal, setActiveModal] = useState<DashboardViewMode | null>(null);

  const handleSelectView = (view: DashboardViewMode) => {
    setActiveView(view);
    if (view !== "dashboard" && view !== "sos" && view !== "ai-assistant") {
      setActiveModal(view);
    } else {
      setActiveModal(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white pb-16 lg:pb-0">
      {/* Left Permanent Sidebar for Desktop (1025px+) */}
      <div className="hidden lg:block">
        <Sidebar activeView={activeView} onSelectView={handleSelectView} />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <TopNavbar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
          {/* View Filter Pill Bar */}
          <div className="flex items-center gap-2 pb-3 overflow-x-auto no-scrollbar border-b border-slate-200">
            {[
              { id: "dashboard", label: "Dashboard Overview" },
              { id: "my-requests", label: "My Requests" },
              { id: "shelters", label: "Nearby Shelters" },
              { id: "alerts", label: "Live Alerts" },
              { id: "guide", label: "Emergency Guide" },
              { id: "profile", label: "My Profile" },
              { id: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSelectView(tab.id as DashboardViewMode)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeView === tab.id
                    ? "bg-red-600 text-white shadow-md shadow-red-950"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Summary Stats Cards */}
          <StatsCard />

          {/* Large SOS Hero Card */}
          <SOSCard />

          {/* 2-Column Grid: Left Main Grid & Right Information Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column (8 cols): Map & AI Chat & Requests */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              <MapCard />
              <AIQuickCard />
              <div id="my-requests">
                <RequestCard />
              </div>
            </div>

            {/* Right Information Panel (4 cols): Alerts & Shelters */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              <div id="alerts">
                <AlertCard />
              </div>
              <div id="shelters">
                <ShelterCard />
              </div>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <FooterCTA />
        </main>
      </div>

      {/* Mobile Fixed Bottom Touch Navigation Bar (320px-1024px) */}
      <BottomMobileNav activeView={activeView} onSelectView={handleSelectView} />

      {/* Interactive Modals for Action Buttons */}

      {/* 1. MY REQUESTS MODAL */}
      {activeModal === "my-requests" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 rounded-2xl text-white">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">My Active SOS Requests</h3>
                <p className="text-xs text-slate-400">Real-time status of your submitted emergency alerts</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <span className="font-extrabold text-red-400">SOS-9081 (FLOOD TRAP)</span>
                  <span className="px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-bold self-start sm:self-auto">
                    CRITICAL PRIORITY
                  </span>
                </div>
                <p className="text-slate-300 font-sans">
                  Description: Rising flood water trapped 4 family members on roof.
                </p>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-2 border-t border-slate-900 text-slate-400 font-sans gap-1">
                  <span>Assigned: Coast Guard Unit #4</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    DISPATCHED (ETA 3 mins)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider"
            >
              Close Requests Modal
            </button>
          </div>
        </div>
      )}

      {/* 2. NEARBY SHELTERS MODAL */}
      {activeModal === "shelters" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-2xl text-white">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">Regional Evacuation Shelters</h3>
                <p className="text-xs text-slate-400">Live bed capacity and medical facility status</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between font-bold text-slate-200 gap-1">
                  <span>Central High School Shelter</span>
                  <span className="text-emerald-400">180 / 250 Beds Available</span>
                </div>
                <p className="text-slate-400">Address: 1420 Market St, Sector 4 • Food &amp; Medical Ready</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between font-bold text-slate-200 gap-1">
                  <span>Community Arena Dome</span>
                  <span className="text-amber-400">45 / 400 Beds Available</span>
                </div>
                <p className="text-slate-400">Address: 850 Mission St • Emergency Power &amp; ICU Backup</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider"
            >
              Close Shelters Modal
            </button>
          </div>
        </div>
      )}

      {/* 3. LIVE ALERTS MODAL */}
      {activeModal === "alerts" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-600 rounded-2xl text-white">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">Live Emergency Broadcast Alerts</h3>
                <p className="text-xs text-slate-400">EOC Broadcast Feed &amp; Severe Weather Warnings</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-red-950/60 border border-red-800/80 rounded-2xl space-y-1">
                <div className="flex justify-between font-bold text-red-300">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    SEVERE FLOOD WARNING (SECTOR 4)
                  </span>
                  <span>10m ago</span>
                </div>
                <p className="text-slate-300">
                  Riverbank water levels rising rapidly. Move to upper floors or designated high-ground shelters.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Coast Guard Rescue Unit Dispatched</span>
                  <span>25m ago</span>
                </div>
                <p className="text-slate-400">
                  Unit #4 deployed with 2 evacuation boats to Sector 4 harbor.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider"
            >
              Close Alerts Modal
            </button>
          </div>
        </div>
      )}

      {/* 4. EMERGENCY GUIDE MODAL */}
      {activeModal === "guide" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 rounded-2xl text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">Disaster Survival Guide</h3>
                <p className="text-xs text-slate-400">Step-by-step AI safety protocols for extreme hazards</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider">🌊 Flood Survival Protocol</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Move immediately to higher ground or roof structures.</li>
                  <li>Do NOT walk or drive through flowing water.</li>
                  <li>Signal rescue helicopters with bright cloth or flashlight.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider">🔥 Fire Survival Protocol</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Stay low under smoke to avoid toxic inhalation.</li>
                  <li>Feel doors for heat with the back of your hand before opening.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider"
            >
              Close Survival Guide
            </button>
          </div>
        </div>
      )}

      {/* 5. PROFILE MODAL */}
      {activeModal === "profile" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 rounded-2xl text-white">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">Citizen Profile</h3>
                <p className="text-xs text-slate-400">Emergency medical &amp; identity card</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Full Name:</span>
                <strong className="text-white">{userProfile?.name || "Akash R."}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <strong className="text-white">{userProfile?.email || "user@rescueai.org"}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blood Type:</span>
                <strong className="text-red-400 flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 fill-red-500" /> O Positive
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Contact:</span>
                <strong className="text-emerald-400">+1 (555) 019-2834</strong>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider"
            >
              Close Profile Card
            </button>
          </div>
        </div>
      )}

      {/* 6. SETTINGS MODAL */}
      {activeModal === "settings" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-800 rounded-2xl text-white">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">Portal Settings</h3>
                <p className="text-xs text-slate-400">PWA, Geolocation &amp; Sync Preferences</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                <span>High-Precision Satellite GPS</span>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 rounded-md">
                  ENABLED
                </span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                <span>Offline IndexedDB Mesh Cache</span>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 rounded-md">
                  ACTIVE
                </span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                <span>PWA Service Worker Push Alerts</span>
                <span className="px-2 py-0.5 bg-blue-950 text-blue-400 font-bold border border-blue-800 rounded-md">
                  READY
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider"
            >
              Save &amp; Close Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
