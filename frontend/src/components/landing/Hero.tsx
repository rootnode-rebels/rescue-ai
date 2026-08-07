"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  MapPin,
  Play,
  X,
  Sparkles,
} from "lucide-react";
import { EmergencySOSModal } from "./EmergencySOSModal";

export const Hero: React.FC = () => {
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative min-h-[90vh] lg:min-h-[92vh] pt-10 pb-28 lg:pt-16 lg:pb-36 flex items-center overflow-hidden bg-gradient-to-b from-[#08101D] via-[#0b1628] to-[#08101D] text-white">
        {/* Background Mesh Grid & Cinematic Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Radial Flares */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]" />

          {/* Radial Glow Behind Phone Mockup */}
          <div className="absolute top-1/2 right-10 lg:right-24 -translate-y-1/2 w-[450px] h-[450px] bg-red-600/20 rounded-full blur-[120px]" />

          {/* Grid Background */}
          <div className="h-full w-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />

          {/* Emergency Particles Floating */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3], y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4], y: [10, -10, 10] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa]"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.6, 0.2], y: [-15, 15, -15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]"
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Description & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-8 text-center lg:text-left"
            >
              {/* Premium Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-red-400 text-xs font-extrabold uppercase tracking-[0.15em] shadow-2xl backdrop-blur-md">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>Next-Gen Disaster Response &amp; Emergency Coordination</span>
              </div>

              {/* Headline: 80px Desktop, Line Height 0.95, Highlight "Matters During" */}
              <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-tight leading-[0.95] text-white">
                Every Second <br />
                <span className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]">
                  Matters During
                </span>{" "}
                <br />
                a Disaster.
              </h1>

              {/* Subheading: 18px, Lighter Gray, Increased Width */}
              <p className="text-lg sm:text-[18px] text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                RescueAI is an AI-Powered Disaster Response &amp; Emergency Coordination Platform that enables citizens to send SOS requests, intelligently prioritizes emergencies using AI, and helps rescue teams respond faster.
              </p>

              {/* Buttons: Large, Rounded-xl / Rounded-2xl, 20px spacing */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-[20px] pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 uppercase tracking-wider group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#features"
                  className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-800 transition-all duration-200 text-center"
                >
                  Learn More
                </a>

                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="w-full sm:w-auto px-6 py-4 bg-slate-800/60 hover:bg-slate-800 text-blue-400 font-bold text-sm rounded-2xl border border-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current text-blue-400" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Bottom Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-slate-400 font-bold border-t border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span>Real Time</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>99.9% Reliable</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Premium Mobile Phone Mockup & 4 Floating Glass Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative py-8 flex items-center justify-center"
            >
              {/* Premium Phone Mockup */}
              <div className="relative w-[310px] sm:w-[340px] bg-slate-950 rounded-[50px] p-4 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/60 overflow-hidden z-10">
                {/* Phone Top Notch */}
                <div className="mx-auto w-32 h-4 bg-slate-900 rounded-b-xl mb-3 flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                </div>

                {/* Mobile Display */}
                <div className="bg-slate-900 rounded-[38px] p-4 space-y-4 border border-slate-800/80">
                  {/* Header Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[11px] font-bold tracking-wider text-slate-200">
                        RESCUE MOBILE
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-mono font-bold">
                      GPS ACTIVE
                    </span>
                  </div>

                  {/* Modern Interactive GPS Map Container */}
                  <div className="relative h-48 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
                    <div className="absolute w-36 h-36 rounded-full border border-blue-500/30 animate-ping" />
                    <div className="absolute w-24 h-24 rounded-full border border-red-500/40" />

                    {/* Emergency Location Marker */}
                    <div className="relative z-10 p-3 bg-red-600 rounded-full text-white shadow-xl shadow-red-600/50">
                      <MapPin className="w-6 h-6 animate-bounce" />
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1 bg-slate-900/90 text-[9px] font-mono text-slate-300 rounded-xl border border-slate-800 flex justify-between">
                      <span>LAT: 37.7749° N</span>
                      <span>LNG: -122.4194° W</span>
                    </div>
                  </div>

                  {/* Large Red One-Tap SOS Button */}
                  <button
                    onClick={() => setIsSosOpen(true)}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/50 uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Flame className="w-5 h-5 text-white animate-pulse" />
                    <span>ONE-TAP SOS</span>
                  </button>
                </div>
              </div>

              {/* FLOATING CARD 1 (Top Left): Critical SOS - Red Glass Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-6 bg-slate-900/90 backdrop-blur-xl border border-red-500/50 rounded-2xl p-4 shadow-2xl max-w-[220px] z-20"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-600/30 text-red-400 rounded-xl border border-red-500/40">
                    <Flame className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Critical SOS</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Flood Trap • 4 Citizens</p>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING CARD 2 (Right): High Priority - Yellow Card */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/3 -right-8 bg-slate-900/90 backdrop-blur-xl border border-amber-500/50 rounded-2xl p-4 shadow-2xl max-w-[210px] z-20 hidden sm:block"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-white block">High Priority</span>
                    <p className="text-[10px] text-amber-400 font-mono mt-0.5">Priority Score: 0.98</p>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING CARD 3 (Bottom Left): AI Analysis - Blue Glass Card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-16 -left-8 bg-slate-900/90 backdrop-blur-xl border border-blue-500/50 rounded-2xl p-4 shadow-2xl max-w-[230px] z-20 hidden sm:block"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                    <Bot className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-white block">AI Analysis Active</span>
                    <p className="text-[10px] text-blue-400 mt-0.5">Gemini Multimodal Triage</p>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING CARD 4 (Bottom Right): Rescue Team Assigned - Green Glass Card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -bottom-6 right-2 bg-slate-900/90 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-4 shadow-2xl max-w-[250px] z-20"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Rescue Team Assigned</span>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Coast Guard #4 (ETA 3 Mins)</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Watch Demo Modal */}
      <AnimatePresence>
        {isDemoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 text-white overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-400 fill-current" />
                  <h3 className="font-extrabold text-base">RescueAI Platform Demo</h3>
                </div>
                <button
                  onClick={() => setIsDemoOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-6 aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4 p-8 text-center">
                <div className="p-4 bg-red-600/20 text-red-500 rounded-full border border-red-500/30 animate-pulse">
                  <Play className="w-12 h-12 fill-current" />
                </div>
                <h4 className="text-lg font-bold">Interactive Platform Preview</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Demonstrates 1-tap SOS geolocation broadcast, Gemini AI emergency triage, and real-time EOC dispatch grid.
                </p>
              </div>

              <button
                onClick={() => setIsDemoOpen(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-xl"
              >
                Close Demo Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emergency SOS Modal */}
      <EmergencySOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
};
