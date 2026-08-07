"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cpu } from "lucide-react";

export const AIStatusCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#08101D] text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4 relative overflow-hidden"
    >
      {/* Glow Ambient Accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
            AI ENGINE METRICS
          </span>
        </div>
        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          ONLINE
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <span className="text-slate-400 font-semibold">Active Model:</span>
          <span className="text-slate-100 font-bold">RescueAI Assistant</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <span className="text-slate-400 font-semibold">Response Latency:</span>
          <span className="text-purple-400 font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            0.8 sec
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-semibold">Accuracy Rating:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            98% Confidence
          </span>
        </div>
      </div>
    </motion.div>
  );
};
