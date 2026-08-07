"use client";

import React, { useState } from "react";
import { Layers, Radio } from "lucide-react";

interface HeatmapPoint {
  id: string;
  lat: number;
  lng: number;
  intensity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string;
}

const MOCK_HEATMAP_POINTS: HeatmapPoint[] = [
  { id: "h1", lat: 37.7749, lng: -122.4194, intensity: "CRITICAL", category: "FLOOD" },
  { id: "h2", lat: 37.7833, lng: -122.4167, intensity: "CRITICAL", category: "EARTHQUAKE" },
  { id: "h3", lat: 37.7695, lng: -122.4469, intensity: "HIGH", category: "FIRE" },
  { id: "h4", lat: 37.7510, lng: -122.4180, intensity: "MEDIUM", category: "MEDICAL" },
];

export const IncidentHeatmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"HEATMAP" | "SATELLITE" | "CLUSTER">("HEATMAP");

  const criticalCount = MOCK_HEATMAP_POINTS.filter((p) => p.intensity === "CRITICAL").length;
  const highCount = MOCK_HEATMAP_POINTS.filter((p) => p.intensity === "HIGH").length;
  const medCount = MOCK_HEATMAP_POINTS.filter((p) => p.intensity === "MEDIUM").length;

  return (
    <div className="relative w-full h-96 rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
      {/* Map Embed Background */}
      <iframe
        title="Incident Heatmap Matrix"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=37.7749,-122.4194&zoom=13`
            : `https://maps.google.com/maps?q=37.7749,-122.4194&z=13&output=embed`
        }
        className="w-full h-full grayscale contrast-[1.2] opacity-80"
      />

      {/* Layer Control Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-lg">
        <div className="p-2 text-red-500">
          <Layers className="w-4 h-4" />
        </div>
        {(["HEATMAP", "SATELLITE", "CLUSTER"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === tab
                ? "bg-red-600 text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Live Cluster Overlay Indicator */}
      <div className="absolute bottom-4 left-4 z-10 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          <span>{MOCK_HEATMAP_POINTS.length} ACTIVE INCIDENT CLUSTERS IN SECTOR 4</span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" /> CRITICAL ({criticalCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> HIGH ({highCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> MED ({medCount})
          </span>
        </div>
      </div>
    </div>
  );
};
