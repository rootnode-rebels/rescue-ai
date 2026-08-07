"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, MapPin, Navigation } from "lucide-react";

export const ShelterCard: React.FC = () => {
  const shelters = [
    {
      name: "Central High School Shelter",
      distance: "0.8 Miles",
      capacity: "65% Full",
      status: "OPEN",
      address: "450 Geary St, San Francisco",
      phone: "+1 (415) 555-0192",
    },
    {
      name: "City Arena Hall",
      distance: "1.4 Miles",
      capacity: "40% Full",
      status: "OPEN",
      address: "900 Market St, San Francisco",
      phone: "+1 (415) 555-0841",
    },
    {
      name: "North Medical Center",
      distance: "2.1 Miles",
      capacity: "82% Full",
      status: "OPEN",
      address: "1200 Van Ness Ave, San Francisco",
      phone: "+1 (415) 555-0319",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900">Nearby Shelters</h3>
        </div>
        <span className="px-2.5 py-0.5 bg-green-100 text-green-700 font-bold text-[10px] rounded-full">
          8 OPEN NEARBY
        </span>
      </div>

      {/* Shelter Items */}
      <div className="space-y-3">
        {shelters.map((s) => (
          <div
            key={s.name}
            className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:bg-white hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900">{s.name}</h4>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-600 font-mono font-bold text-[9px] rounded-md">
                {s.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>{s.address} ({s.distance})</span>
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600 font-semibold text-[11px]">Occupancy: {s.capacity}</span>
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(s.address)}`, "_blank")}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold transition-colors flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                <span>Route</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
