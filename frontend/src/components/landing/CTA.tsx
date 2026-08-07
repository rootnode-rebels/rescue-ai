"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight, LogIn, UserPlus, Flame } from "lucide-react";
import { EmergencySOSModal } from "./EmergencySOSModal";

export const CTA: React.FC = () => {
  const [isSosOpen, setIsSosOpen] = useState(false);

  return (
    <>
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white rounded-3xl p-10 sm:p-16 lg:p-20 shadow-2xl border border-slate-800 overflow-hidden text-center"
          >
            {/* Background Light Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Zero Latency Emergency Preparedness</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Be Prepared Before Disaster Strikes.
              </h2>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Join thousands of citizens, response agencies, and emergency operators utilizing RescueAI for autonomous disaster coordination and instant SOS dispatch.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-7 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-base rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login to Portal</span>
                </Link>

                <button
                  onClick={() => setIsSosOpen(true)}
                  className="w-full sm:w-auto px-7 py-4 bg-slate-900/80 hover:bg-slate-900 text-red-400 font-bold text-base rounded-2xl border border-red-900/60 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                  <span>Emergency SOS</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency SOS Modal */}
      <EmergencySOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
};
