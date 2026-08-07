"use client";

import React, { useState } from "react";
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
          {activeView === "profile" && <ProfileSettingsTab mode="profile" />}
          {activeView === "settings" && <ProfileSettingsTab mode="settings" />}
        </main>
      </div>
    </div>
  );
};
