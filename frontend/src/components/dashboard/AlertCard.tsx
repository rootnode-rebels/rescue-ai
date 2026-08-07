"use client";

import React from "react";
import { motion } from "framer-motion";
import { CloudRain, AlertTriangle, Wind } from "lucide-react";

export const AlertCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-amber-950/90 text-amber-100 rounded-3xl p-6 shadow-xl border border-amber-800/80 space-y-4 relative overflow-hidden"
    >
      {/* Background Warning Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <AlertTriangle className="w-5 h-5 animate-bounce text-amber-400" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            WEATHER ALERT
          </span>
        </div>
        <span className="px-2 py-0.5 bg-amber-500/30 text-amber-300 rounded-full text-[9px] font-mono font-bold">
          HIGH SEVERITY
        </span>
      </div>

      <div>
        <h4 className="text-lg font-black text-white">Flash Flood Watch Issued</h4>
        <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
          National Weather Service has issued a Flash Flood Watch for Bay Area Sectors 3-8 until 8:00 PM tonight. Heavy precipitation expected.
        </p>
      </div>

      {/* Metric Pills */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
        <div className="p-2.5 bg-black/30 rounded-xl border border-amber-800/60 flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-amber-400" />
          <span>Precip: 3.2 in/hr</span>
        </div>
        <div className="p-2.5 bg-black/30 rounded-xl border border-amber-800/60 flex items-center gap-2">
          <Wind className="w-4 h-4 text-amber-400" />
          <span>Wind: 35 mph</span>
        </div>
      </div>
    </motion.div>
  );
};
