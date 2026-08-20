"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Radio, Volume2, Power, AlertTriangle, ShieldAlert } from "lucide-react";

export const FMRadioView: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const [frequency, setFrequency] = useState(88.5);

  const predefinedChannels = [
    { freq: 88.5, name: "National Emergency Broadcast", type: "CRITICAL" },
    { freq: 91.2, name: "Local Weather & Warnings", type: "WEATHER" },
    { freq: 104.5, name: "Community Relief Updates", type: "RELIEF" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-700">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Hardware FM Radio</h3>
            <p className="text-xs text-slate-500 font-medium">Using internal FM receiver chip. Zero data required.</p>
          </div>
        </div>
        <button onClick={() => setIsOn(!isOn)} className={p-3 rounded-full transition-all }>
          <Power className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        <div className="text-center space-y-2 relative z-10">
          <div className={	ext-6xl font-black font-mono tracking-tighter }>
            {frequency.toFixed(1)} <span className="text-2xl text-slate-500">MHz</span>
          </div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            {isOn ? predefinedChannels.find((c) => c.freq === frequency)?.name || "Scanning..." : "Power Off"}
          </div>
        </div>

        <div className="w-full max-w-md relative z-10 pt-4">
          <input type="range" min="87.5" max="108.0" step="0.1" value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))} disabled={!isOn} className="w-full accent-emerald-500 disabled:opacity-30" />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 font-bold">
            <span>87.5</span>
            <span>98.0</span>
            <span>108.0</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Emergency Frequencies</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {predefinedChannels.map((channel) => (
            <button key={channel.freq} onClick={() => { setIsOn(true); setFrequency(channel.freq); }} className={p-4 rounded-2xl border text-left transition-all }>
              <div className="text-lg font-black text-slate-900 font-mono">{channel.freq}</div>
              <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase line-clamp-1">{channel.name}</div>
              <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                <ShieldAlert className="w-3 h-3" />
                <span>{channel.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
