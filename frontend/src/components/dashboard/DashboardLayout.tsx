"use client";

import React, { useState } from "react";
import { Smartphone, Download } from "lucide-react";
import { Sidebar, DashboardViewMode } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { StatsCard } from "./StatsCard";
import { SOSCard } from "./SOSCard";
import { MapCard } from "./MapCard";
import { AIQuickCard } from "./AIQuickCard";
import { RequestCard } from "./RequestCard";
import { AlertCard } from "./AlertCard";
import { ShelterCard } from "./ShelterCard";
import { EmergencyGuideTab } from "./EmergencyGuideTab";
import { OfflineAppsHub } from "./OfflineAppsHub";
import { SocialPreviewHub } from "./SocialPreviewHub";
import { CitizenSOSTrackerWithNotifications } from "./CitizenSOSTrackerWithNotifications";
import { ProfileSettingsTab } from "./ProfileSettingsTab";
import { useAuth } from "@/hooks/useAuth";

export const DashboardLayout: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeView, setActiveView] = useState<DashboardViewMode>("dashboard");

  const handleSelectView = (view: DashboardViewMode) => {
    setActiveView(view);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white pb-16 lg:pb-0">
      {/* Left Permanent Sidebar for Desktop */}
      <div className="hidden lg:block">
        <Sidebar activeView={activeView} onSelectView={handleSelectView} />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <TopNavbar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
          {/* View Filter Pill Bar & Social Share Hub */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {[
                { id: "dashboard", label: "Dashboard Overview" },
                { id: "my-requests", label: "My Requests" },
                { id: "shelters", label: "Nearby Shelters" },
                { id: "alerts", label: "Live Alerts" },
                { id: "guide", label: "Emergency Guide" },
                { id: "offline-apps", label: "Offline Apps & Mesh" },
                { id: "profile", label: "My Profile" },
                { id: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleSelectView(tab.id as DashboardViewMode)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    activeView === tab.id
                      ? "bg-red-600 text-white shadow-md shadow-red-950"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Social Share Hub Trigger Button */}
            <div className="shrink-0">
              <SocialPreviewHub />
            </div>
          </div>

          {/* Citizen Live Push Notification & Incident Tracker */}
          <CitizenSOSTrackerWithNotifications />

          {/* Mandatory Mobile App Download Requirement Banner for Citizens */}
          <div className="bg-gradient-to-r from-red-900 via-red-800 to-slate-900 border border-red-500/50 rounded-3xl p-5 shadow-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-950 animate-bounce">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-red-500/30 border border-red-400/40 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-red-200 mb-1">
                  <span>Compulsory Requirement</span>
                </div>
                <h4 className="font-black text-sm text-white uppercase tracking-tight">
                  Mobile App Installation Required For Citizens
                </h4>
                <p className="text-xs text-red-100 font-medium">
                  Install the 15.26 MB RescueAI Mobile App APK on your mobile phone for offline emergency dispatch and satellite GPS lock.
                </p>
              </div>
            </div>

            <a
              href="/download"
              className="px-6 py-3 bg-white text-red-950 hover:bg-slate-100 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4 text-red-600" />
              <span>Download 15.26 MB APK</span>
            </a>
          </div>

          {/* Conditional View Rendering based on activeView */}
          {activeView === "dashboard" && (
            <>
              <StatsCard />
              <SOSCard />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                  <MapCard />
                  <AIQuickCard />
                  <RequestCard />
                </div>
                <div className="lg:col-span-4 space-y-6 sm:space-y-8">
                  <AlertCard />
                  <ShelterCard />
                </div>
              </div>
            </>
          )}

          {activeView === "my-requests" && <RequestCard />}
          {activeView === "shelters" && <ShelterCard />}
          {activeView === "alerts" && <AlertCard />}
          {activeView === "guide" && <EmergencyGuideTab />}
          {activeView === "offline-apps" && <OfflineAppsHub />}
          {activeView === "profile" && <ProfileSettingsTab mode="profile" />}
          {activeView === "settings" && <ProfileSettingsTab mode="settings" />}
        </main>
      </div>
    </div>
  );
};

