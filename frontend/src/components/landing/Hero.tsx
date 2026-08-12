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
<<<<<<< HEAD
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
=======
      <section id="hero" className="relative min-h-[90vh] lg:min-h-[92vh] pt-10 pb-28 lg:pt-16 lg:pb-36 flex items-center overflow-hidden bg-white text-slate-900 border-b border-slate-100">
        {/* Crisp Monochrome Grid Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-70" />
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
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
<<<<<<< HEAD
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
=======
              {/* Premium Monochrome Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-extrabold uppercase tracking-[0.15em] shadow-sm">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-900"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                <span>Next-Gen Disaster Response &amp; Emergency Coordination</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-tight leading-[0.95] text-slate-900">
                Every Second <br />
                <span className="text-slate-900">
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                  Matters During
                </span>{" "}
                <br />
                a Disaster.
              </h1>

<<<<<<< HEAD
              {/* Subheading: 18px, Lighter Gray, Increased Width */}
              <p className="text-lg sm:text-[18px] text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                RescueAI is an AI-Powered Disaster Response &amp; Emergency Coordination Platform that enables citizens to send SOS requests, intelligently prioritizes emergencies using AI, and helps rescue teams respond faster.
              </p>

              {/* Buttons: Large, Rounded-xl / Rounded-2xl, 20px spacing */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-[20px] pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 uppercase tracking-wider group"
=======
              {/* Subheading */}
              <p className="text-lg sm:text-[18px] text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                RescueAI is an AI-Powered Disaster Response &amp; Emergency Coordination Platform that enables citizens to send SOS requests, intelligently prioritizes emergencies using AI, and helps rescue teams respond faster.
              </p>

              {/* Buttons: Monochrome primary/secondary + RED SOS accent */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-[20px] pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 uppercase tracking-wider group"
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#features"
<<<<<<< HEAD
                  className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-800 transition-all duration-200 text-center"
=======
                  className="w-full sm:w-auto px-7 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm rounded-2xl border border-slate-200 transition-all duration-200 text-center"
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                >
                  Learn More
                </a>

                <button
                  onClick={() => setIsDemoOpen(true)}
<<<<<<< HEAD
                  className="w-full sm:w-auto px-6 py-4 bg-slate-800/60 hover:bg-slate-800 text-blue-400 font-bold text-sm rounded-2xl border border-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current text-blue-400" />
=======
                  className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 transition-all duration-200 flex items-center justify-center gap-2 shadow-xs"
                >
                  <Play className="w-4 h-4 fill-current text-slate-700" />
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                  <span>Watch Demo</span>
                </button>
              </div>

<<<<<<< HEAD
              {/* Bottom Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-slate-400 font-bold border-t border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
=======
              {/* Bottom Badges - Pure Monochrome */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-slate-600 font-bold border-t border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                    <Bot className="w-4 h-4" />
                  </div>
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-2.5">
<<<<<<< HEAD
                  <div className="p-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
=======
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                    <Zap className="w-4 h-4" />
                  </div>
                  <span>Real Time</span>
                </div>
                <div className="flex items-center gap-2.5">
<<<<<<< HEAD
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
=======
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>99.9% Reliable</span>
                </div>
              </div>
            </motion.div>

<<<<<<< HEAD
            {/* Right Column: Premium Mobile Phone Mockup & 4 Floating Glass Cards */}
=======
            {/* Right Column: Pure White Mobile Phone Mockup & Monochrome Glass Cards */}
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative py-8 flex items-center justify-center"
            >
              {/* Premium Phone Mockup */}
<<<<<<< HEAD
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
=======
              <div className="relative w-[310px] sm:w-[340px] bg-slate-900 rounded-[50px] p-4 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-200 overflow-hidden z-10">
                {/* Phone Top Notch */}
                <div className="mx-auto w-32 h-4 bg-slate-950 rounded-b-xl mb-3 flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>

                {/* Mobile Display */}
                <div className="bg-white rounded-[38px] p-4 space-y-4 border border-slate-200 text-slate-900 shadow-inner">
                  {/* Header Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                      <span className="text-[11px] font-bold tracking-wider text-slate-900">
                        RESCUE MOBILE
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-full text-[9px] font-mono font-bold border border-slate-200">
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                      GPS ACTIVE
                    </span>
                  </div>

                  {/* Modern Interactive GPS Map Container */}
<<<<<<< HEAD
                  <div className="relative h-48 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
                    <div className="absolute w-36 h-36 rounded-full border border-blue-500/30 animate-ping" />
                    <div className="absolute w-24 h-24 rounded-full border border-red-500/40" />

                    {/* Emergency Location Marker */}
                    <div className="relative z-10 p-3 bg-red-600 rounded-full text-white shadow-xl shadow-red-600/50">
                      <MapPin className="w-6 h-6 animate-bounce" />
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1 bg-slate-900/90 text-[9px] font-mono text-slate-300 rounded-xl border border-slate-800 flex justify-between">
=======
                  <div className="relative h-48 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
                    <div className="absolute w-36 h-36 rounded-full border border-slate-300 animate-ping" />
                    <div className="absolute w-24 h-24 rounded-full border border-red-200" />

                    {/* Emergency Location Marker (Striking Red Accent) */}
                    <div className="relative z-10 p-3 bg-red-600 rounded-full text-white shadow-xl shadow-red-600/30">
                      <MapPin className="w-6 h-6 animate-bounce" />
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1 bg-white/95 text-[9px] font-mono text-slate-700 rounded-xl border border-slate-200 flex justify-between shadow-xs">
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                      <span>LAT: 37.7749° N</span>
                      <span>LNG: -122.4194° W</span>
                    </div>
                  </div>

<<<<<<< HEAD
                  {/* Large Red One-Tap SOS Button */}
                  <button
                    onClick={() => setIsSosOpen(true)}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/50 uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
=======
                  {/* Striking Red One-Tap SOS Button */}
                  <button
                    onClick={() => setIsSosOpen(true)}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/40 uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                  >
                    <Flame className="w-5 h-5 text-white animate-pulse" />
                    <span>ONE-TAP SOS</span>
                  </button>
                </div>
              </div>

<<<<<<< HEAD
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
=======
              {/* FLOATING CARD 1 (Top Left): Critical SOS - Red Accent Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-6 bg-white/95 backdrop-blur-xl border border-red-200 rounded-2xl p-4 shadow-xl max-w-[220px] z-20"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-600 text-white rounded-xl shadow-md shadow-red-600/20">
                    <Flame className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">Critical SOS</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Flood Trap • 4 Citizens</p>
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                  </div>
                </div>
              </motion.div>

<<<<<<< HEAD
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
=======
              {/* FLOATING CARD 2 (Right): High Priority - Monochrome Card */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/3 -right-8 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xl max-w-[210px] z-20 hidden sm:block"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">High Priority</span>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Priority Score: 0.98</p>
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                  </div>
                </div>
              </motion.div>

<<<<<<< HEAD
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
=======
              {/* FLOATING CARD 3 (Bottom Left): AI Analysis - Monochrome Card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-16 -left-8 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xl max-w-[230px] z-20 hidden sm:block"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
                    <Bot className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">AI Analysis Active</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Gemini Multimodal Triage</p>
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                  </div>
                </div>
              </motion.div>

<<<<<<< HEAD
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
=======
              {/* FLOATING CARD 4 (Bottom Right): Rescue Team Assigned - Monochrome Card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -bottom-6 right-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xl max-w-[250px] z-20"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Rescue Team Assigned</span>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Coast Guard #4 (ETA 3 Mins)</p>
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Watch Demo Modal */}
      <AnimatePresence>
        {isDemoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
=======
      {/* Watch Demo Modal - Clean White Theme */}
      <AnimatePresence>
        {isDemoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
<<<<<<< HEAD
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
=======
              className="relative w-full max-w-3xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-slate-900 fill-current" />
                  <h3 className="font-extrabold text-base text-slate-900">RescueAI Platform Demo</h3>
                </div>
                <button
                  onClick={() => setIsDemoOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

<<<<<<< HEAD
              <div className="my-6 aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4 p-8 text-center">
                <div className="p-4 bg-red-600/20 text-red-500 rounded-full border border-red-500/30 animate-pulse">
                  <Play className="w-12 h-12 fill-current" />
                </div>
                <h4 className="text-lg font-bold">Interactive Platform Preview</h4>
                <p className="text-xs text-slate-400 max-w-md">
=======
              <div className="my-6 aspect-video bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-4 p-8 text-center">
                <div className="p-4 bg-red-600 text-white rounded-full shadow-lg shadow-red-600/30 animate-pulse">
                  <Play className="w-12 h-12 fill-current" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Interactive Platform Preview</h4>
                <p className="text-xs text-slate-500 max-w-md">
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
                  Demonstrates 1-tap SOS geolocation broadcast, Gemini AI emergency triage, and real-time EOC dispatch grid.
                </p>
              </div>

              <button
                onClick={() => setIsDemoOpen(false)}
<<<<<<< HEAD
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-xl"
=======
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
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
<<<<<<< HEAD
=======

>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
