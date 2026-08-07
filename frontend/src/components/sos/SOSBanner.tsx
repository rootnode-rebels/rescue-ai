"use client";

import React from "react";
import { motion } from "framer-motion";
import { Radio, Flame, Zap } from "lucide-react";

export const SOSBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-red-600/30 overflow-hidden"
    >
      {/* Background Ambient Lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center md:text-left">
          {/* Animated Icon Badge */}
          <div className="relative flex items-center justify-center w-16 h-16 bg-white text-red-600 rounded-2xl shadow-xl shrink-0 mx-auto md:mx-0">
            <Flame className="w-9 h-9 animate-bounce text-red-600" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-wider text-red-100 backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-white animate-spin" />
              <span>DIRECT SATELLITE BROADCAST CHANNEL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              SOS – Get Help Now
            </h1>
            <p className="text-sm text-red-100 font-medium max-w-xl">
              Send your emergency details &amp; live GPS coordinates to nearby rescue teams and emergency centers immediately.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-black/20 border border-white/20 rounded-2xl text-xs font-mono text-red-100 shrink-0">
          <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>EOC PRIORITY NODE #902</span>
        </div>
      </div>
    </motion.div>
  );
};
