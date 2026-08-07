"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flame, MapPin, Radio, Zap } from "lucide-react";
import { EmergencySOSModal } from "../landing/EmergencySOSModal";

export const SOSCard: React.FC = () => {
  const [isSosOpen, setIsSosOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-red-600 via-red-600 to-red-700 text-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-red-600/30 overflow-hidden"
      >
        {/* Ambient Light Flares */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Location Specs */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 border border-white/30 rounded-full text-xs font-black uppercase tracking-wider text-red-100 backdrop-blur-md">
              <Radio className="w-4 h-4 text-white animate-spin" />
              <span>EMERGENCY DISPATCH NODE #902</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Need Immediate Help?
            </h2>

            <p className="text-sm text-red-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Tap the emergency SOS button to transmit your live satellite GPS coordinates directly to the nearest Emergency Operations Center (EOC) and active rescue units.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-red-100 font-mono">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-white" />
                <span>37.7749° N, 122.4194° W</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
                <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>AI TRIAGE: ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Right Action: Large Animated SOS Button */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Concentric Pulsing Radar Rings */}
              <div className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-50" />
              <div className="absolute -inset-4 rounded-full border-2 border-white/40 animate-pulse" />

              <button
                onClick={() => setIsSosOpen(true)}
                className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 bg-white hover:bg-slate-50 text-red-600 rounded-full shadow-2xl shadow-black/40 flex flex-col items-center justify-center gap-2 group active:scale-95 transition-all duration-300"
                aria-label="Broadcast Emergency SOS Signal"
              >
                <div className="p-3 bg-red-100 text-red-600 rounded-full group-hover:scale-110 transition-transform">
                  <Flame className="w-10 h-10 animate-bounce text-red-600" />
                </div>
                <span className="text-base sm:text-lg font-black tracking-widest uppercase">
                  TAP SOS
                </span>
              </button>
            </div>
            <span className="text-[11px] font-bold text-red-200 uppercase tracking-widest mt-4">
              Press to Broadcast Instant Alert
            </span>
          </div>
        </div>
      </motion.div>

      {/* Emergency SOS Modal */}
      <EmergencySOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
};
