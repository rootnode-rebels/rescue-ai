"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, AlertTriangle, ShieldCheck, Zap, ShieldAlert } from "lucide-react";

export const Comparison: React.FC = () => {
  const traditionalPoints = [
    { title: "Manual Calls", desc: "Congested emergency hotlines during regional disaster surges." },
    { title: "Slow Response", desc: "Manual dispatcher address logging and paper queue delays." },
    { title: "No AI Intelligence", desc: "First-come queueing regardless of life-threatening severity." },
    { title: "Poor Coordination", desc: "Communication silos between Fire, Medical, and Police." },
    { title: "No Offline Support", desc: "Complete blackout when local cell towers or internet drop." },
  ];

  const rescueAiPoints = [
    { title: "AI Priority Detection", desc: "Instant automated triage classifying Critical, High, Medium, Low." },
    { title: "Real Time Dashboard", desc: "Live GIS tracking with responder telemetry & status." },
    { title: "Live GPS Telemetry", desc: "High-accuracy geolocation tags attached to distress calls." },
    { title: "Smart Dispatch", desc: "Automated routing recommending nearest available unit." },
    { title: "Offline First Mesh", desc: "Queues and syncs SOS distress alerts even with zero internet." },
    { title: "Emergency Operations Center", desc: "Single multi-agency command bridge for all responders." },
  ];

  return (
    <section id="why-rescueai" className="py-32 bg-slate-50/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header with Center Shield */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          {/* Center Large RescueAI Shield */}
          <div className="mx-auto w-20 h-20 bg-red-600 rounded-[24px] text-white flex items-center justify-center shadow-2xl shadow-red-600/40 mb-6 animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <span className="px-4 py-1.5 bg-red-100 border border-red-200 text-red-700 font-extrabold text-xs uppercase tracking-[0.2em] rounded-full inline-block">
            SYSTEM COMPARISON
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Why RescueAI?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            See how RescueAI transforms traditional legacy dispatch into a resilient, AI-accelerated crisis coordination network.
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Left Card: Traditional System (Light Red Tint & Border) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-red-50/40 rounded-[24px] p-8 sm:p-10 shadow-sm border border-red-200/80 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3.5 pb-6 border-b border-red-200/60 mb-6">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl border border-red-200 shadow-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">Legacy Infrastructure</span>
                  <h3 className="text-2xl font-black text-slate-900">Traditional System</h3>
                </div>
              </div>

              <ul className="space-y-5">
                {traditionalPoints.map((pt) => (
                  <li key={pt.title} className="flex items-start gap-3.5">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{pt.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{pt.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-red-200/60 text-xs font-semibold text-slate-500 text-center">
              Legacy response latency: <strong className="text-red-600 font-bold">15 - 45 Minutes</strong>
            </div>
          </motion.div>

          {/* Right Card: RescueAI (Dark Navy Contrast & Green Accents) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#08101D] text-white rounded-[24px] p-8 sm:p-10 shadow-2xl border border-emerald-500/40 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">AI-Powered Platform</span>
                    <h3 className="text-2xl font-black text-white">RescueAI</h3>
                  </div>
                </div>
                <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                  NEXT-GEN
                </span>
              </div>

              <ul className="space-y-5">
                {rescueAiPoints.map((pt) => (
                  <li key={pt.title} className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-100">{pt.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{pt.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-slate-800 text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>RescueAI response latency:</span>
              <span className="text-emerald-400 font-black text-sm flex items-center gap-1">
                Under 2 Minutes <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
