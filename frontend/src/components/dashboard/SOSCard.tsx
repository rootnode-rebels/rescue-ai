"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, MapPin, Radio, Zap, ArrowRight, ShieldAlert } from "lucide-react";
import { EmergencySOSModal } from "../landing/EmergencySOSModal";

export const SOSCard: React.FC = () => {
  const [isSosOpen, setIsSosOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-red-600/40 overflow-hidden border border-red-500/30"
      >
        {/* Ambient Light Flares */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Location Specs */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 border border-white/30 rounded-full text-xs font-black uppercase tracking-wider text-red-100 backdrop-blur-md">
              <Radio className="w-4 h-4 text-white animate-pulse" />
              <span>LIVE SATELLITE GPS DISPATCH NODE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Need Immediate Help?
            </h2>

            <p className="text-sm text-red-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Tap the emergency SOS button to transmit your high-precision live GPS coordinates directly to NDRF Command and nearest active rescue squads.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-red-100 font-mono">
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-white animate-bounce" />
                <span>12.9716° N, 77.5946° E</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>GPS STREAM: ACTIVE (&lt;20ms)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center lg:justify-start">
              <Link
                href="/sos"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-red-600 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-lg transition-all uppercase tracking-wider"
              >
                <span>Open Full SOS Module</span>
                <ArrowRight className="w-4 h-4 text-red-600" />
              </Link>
            </div>
          </div>

          {/* Right Action: Large Ultra-Modern Highlighted Animated SOS Button */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Concentric Pulsing Neon Radar Rings */}
              <div className="absolute -inset-6 rounded-full bg-white/30 animate-ping opacity-60 pointer-events-none" />
              <div className="absolute -inset-3 rounded-full border-4 border-white/50 animate-pulse pointer-events-none" />

              <button
                onClick={() => setIsSosOpen(true)}
                className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 bg-white hover:bg-slate-50 text-red-600 rounded-full shadow-2xl shadow-black/50 flex flex-col items-center justify-center gap-2 group active:scale-95 transition-all duration-300 border-4 border-red-100"
                aria-label="Broadcast Emergency SOS Signal"
              >
                <div className="p-3.5 bg-red-100 text-red-600 rounded-full group-hover:scale-110 transition-transform">
                  <Flame className="w-12 h-12 animate-bounce text-red-600" />
                </div>
                <span className="text-lg sm:text-xl font-black tracking-widest uppercase">
                  TAP SOS
                </span>
              </button>
            </div>
            <span className="text-xs font-black text-white uppercase tracking-widest mt-5 bg-black/30 px-4 py-1.5 rounded-full border border-white/20">
              1-Click Instant Emergency Dispatch
            </span>
          </div>
        </div>
      </motion.div>

      {/* Emergency SOS Modal */}
      <EmergencySOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
};
