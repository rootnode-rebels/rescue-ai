"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Radio,
  Cpu,
  Server,
  Flame,
  Sparkles,
  ArrowRight,
  UserPlus,
  LogIn,
  PhoneCall,
} from "lucide-react";
import { EmergencySOSModal } from "./EmergencySOSModal";

export const BottomSection: React.FC = () => {
  const [isSosOpen, setIsSosOpen] = useState(false);

  return (
    <>
      <section className="py-32 bg-slate-50/70 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
            {/* CARD 1: Dark Analytics Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#08101D] text-white rounded-[24px] p-8 sm:p-10 shadow-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-52 h-52 bg-red-600/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="p-2.5 bg-red-600/30 text-red-400 rounded-2xl border border-red-500/40 shadow-sm">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                    REAL-TIME TELEMETRY
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white mb-6">Platform Analytics</h3>

                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold">Emergency Requests</span>
                    <span className="text-xl font-black text-white">5,000+</span>
                  </div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold">Active Rescue Teams</span>
                    <span className="text-xl font-black text-blue-400">100+ Units</span>
                  </div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold">Coordination Rate</span>
                    <span className="text-xl font-black text-emerald-400">98% Accuracy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold">System Availability</span>
                    <span className="text-xl font-black text-green-400">99.9% Uptime</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>EOC MESH NODE</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
            </motion.div>

            {/* CARD 2: White Technology Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white text-slate-900 rounded-[24px] p-8 sm:p-10 shadow-xl border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
                    <Cpu className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
                    ENTERPRISE ARCHITECTURE
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4">Core Technology</h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Engineered with Next.js 15 App Router, FastAPI Python 3.12, Cloud Firestore, and Google Gemini AI for zero latency emergency operations.
                </p>

                {/* Tech Badges Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2 shadow-xs">
                    <Cpu className="w-4 h-4 text-slate-900" />
                    <span>Next.js 15</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2 shadow-xs">
                    <Server className="w-4 h-4 text-emerald-600" />
                    <span>FastAPI</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2 shadow-xs">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Firebase</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2 shadow-xs">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Gemini AI</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>Production Ready</span>
                <span className="text-blue-600 font-bold">Hackathon Build</span>
              </div>
            </motion.div>

            {/* CARD 3: Red Gradient CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-red-600 via-red-600 to-red-700 text-white rounded-[24px] p-8 sm:p-10 shadow-2xl shadow-red-600/40 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="p-2.5 bg-white/20 text-white rounded-2xl backdrop-blur-md">
                    <PhoneCall className="w-5 h-5 animate-pulse" />
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-100">
                    EMERGENCY PREPAREDNESS
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                  Be Prepared Before Disaster Strikes
                </h3>

                <p className="text-xs text-red-100 leading-relaxed mb-6">
                  Join thousands of citizens and rescue agencies using RescueAI for rapid disaster response.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Link
                  href="/register"
                  className="w-full py-4 px-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </Link>

                <Link
                  href="/login"
                  className="w-full py-3.5 px-4 bg-red-700/80 hover:bg-red-700 text-white font-bold text-xs rounded-2xl border border-red-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login to Portal</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency SOS Modal */}
      <EmergencySOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
};
