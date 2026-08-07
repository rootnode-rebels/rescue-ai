"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, RotateCw, Compass, ShieldCheck } from "lucide-react";

export const LocationCard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <MapPin className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900">Live GPS Telemetry</h3>
            <p className="text-[11px] text-gray-500 font-medium">Auto-detected satellite coordinates</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
          aria-label="Refresh GPS Location"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-red-600" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Interactive Map Graphic Canvas */}
      <div className="relative h-60 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
        <div className="absolute w-44 h-44 rounded-full border border-red-500/40 animate-ping" />
        <div className="absolute w-28 h-28 rounded-full border border-blue-500/30" />

        {/* GPS Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-3 bg-red-600 rounded-full text-white shadow-xl shadow-red-600/60 animate-bounce">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="mt-1 px-2.5 py-0.5 bg-slate-900/90 text-[10px] font-mono font-bold text-white rounded-lg border border-slate-700">
            EMERGENCY TARGET NODE
          </span>
        </div>

        {/* Accuracy Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>99% ACCURACY • SATELLITE FIXED</span>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>REAL-TIME TRACKING</span>
        </div>
      </div>

      {/* Location Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Latitude</span>
          <span className="text-gray-900 font-bold">37.7749° N</span>
        </div>
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Longitude</span>
          <span className="text-gray-900 font-bold">-122.4194° W</span>
        </div>
      </div>

      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs">
        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Detected Address</span>
        <span className="text-gray-900 font-bold">450 Geary St, Sector 4, San Francisco, CA 94102</span>
      </div>
    </motion.div>
  );
};
