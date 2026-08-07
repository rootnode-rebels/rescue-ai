"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Minus, Shield, Compass, Radio } from "lucide-react";

export const MapCard: React.FC = () => {
  const [zoom, setZoom] = useState(14);
  const [activeLayer, setActiveLayer] = useState<"all" | "shelters" | "incidents">("all");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-black text-slate-900">Live Geospatial Emergency Map</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Real-time GIS telemetry • 8 Shelters • 1 Active SOS
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveLayer("all")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeLayer === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All Nodes
          </button>
          <button
            onClick={() => setActiveLayer("shelters")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeLayer === "shelters" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Shelters
          </button>
          <button
            onClick={() => setActiveLayer("incidents")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeLayer === "incidents" ? "bg-white text-red-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Incidents
          </button>
        </div>
      </div>

      {/* Map Graphics Canvas Mockup */}
      <div className="relative h-80 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {/* Background Radar Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />

        {/* Concentric GIS Radar Sweeps */}
        <div className="absolute w-72 h-72 rounded-full border border-blue-500/30 animate-ping opacity-40" />
        <div className="absolute w-48 h-48 rounded-full border border-red-500/40" />

        {/* Current User Position Node */}
        <div className="relative z-20 flex flex-col items-center">
          <div className="p-3 bg-red-600 rounded-full text-white shadow-xl shadow-red-600/60 animate-bounce">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="mt-1 px-2.5 py-1 bg-slate-900/90 text-[10px] font-mono font-bold text-white rounded-lg border border-slate-700 shadow-md">
            YOU ARE HERE (37.7749° N)
          </span>
        </div>

        {/* Shelter Node 1 (North-East) */}
        {(activeLayer === "all" || activeLayer === "shelters") && (
          <div className="absolute top-12 right-20 z-10 flex flex-col items-center group cursor-pointer">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-[9px] font-bold text-blue-300 rounded-md border border-slate-800">
              Central Shelter (0.8 mi)
            </span>
          </div>
        )}

        {/* Shelter Node 2 (South-East) */}
        {(activeLayer === "all" || activeLayer === "shelters") && (
          <div className="absolute bottom-12 right-16 z-10 flex flex-col items-center group cursor-pointer">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/40 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-[9px] font-bold text-indigo-300 rounded-md border border-slate-800">
              City Arena (1.4 mi)
            </span>
          </div>
        )}

        {/* Active Incident Marker (South-West) */}
        {(activeLayer === "all" || activeLayer === "incidents") && (
          <div className="absolute bottom-16 left-16 z-10 flex flex-col items-center">
            <div className="p-2 bg-red-500 text-white rounded-full animate-pulse shadow-lg shadow-red-500/50">
              <Radio className="w-4 h-4" />
            </div>
            <span className="mt-1 px-2 py-0.5 bg-red-950/90 text-[9px] font-mono text-red-300 rounded-md border border-red-800">
              SOS #8492 Dispatch
            </span>
          </div>
        )}

        {/* Map Floating Controls (Top Left & Bottom Right) */}
        <div className="absolute top-4 left-4 z-30 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 flex flex-col gap-2 shadow-xl">
          <button
            onClick={() => setZoom(Math.min(zoom + 1, 18))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 1, 10))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-4 right-4 z-30 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400 animate-spin" />
          <span>ZOOM: {zoom}X • SATELLITE 3D</span>
        </div>
      </div>
    </motion.div>
  );
};
