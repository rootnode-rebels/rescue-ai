"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { StatsCard } from "./StatsCard";
import { SOSCard } from "./SOSCard";
import { MapCard } from "./MapCard";
import { AIQuickCard } from "./AIQuickCard";
import { RequestCard } from "./RequestCard";
import { AlertCard } from "./AlertCard";
import { ShelterCard } from "./ShelterCard";
import { FooterCTA } from "./FooterCTA";

export const DashboardLayout: React.FC = () => {
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
          {/* Summary Stats Cards */}
          <StatsCard />

          {/* Large SOS Hero Card */}
          <SOSCard />

          {/* 2-Column Grid: Left Main Grid & Right Information Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (8 cols): Map & AI Chat & Requests */}
            <div className="lg:col-span-8 space-y-8">
              <MapCard />
              <AIQuickCard />
              <RequestCard />
            </div>

            {/* Right Information Panel (4 cols): Alerts & Shelters */}
            <div className="lg:col-span-4 space-y-8">
              <AlertCard />
              <ShelterCard />
            </div>
          </div>

          {/* Bottom Call to Action */}
          <FooterCTA />
        </main>
      </div>
    </div>
  );
};
