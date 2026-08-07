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

export const SOSModuleLayout: React.FC = () => {
  const [description, setDescription] = useState("");
  const [emergencyType, setEmergencyType] = useState("Flood");
  const [peopleAffected, setPeopleAffected] = useState(1);

  const handleSendAlert = () => {
    console.log("SOS Alert Transmitted:", { emergencyType, description, peopleAffected });
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
    </div>
  );
};
