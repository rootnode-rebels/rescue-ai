"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Send,
  MapPin,
  Brain,
  AlertTriangle,
  LayoutDashboard,
  Siren,
  ArrowDown,
} from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Citizen Sends SOS",
      description: "Citizen triggers the one-tap emergency SOS request or submits voice/photo details.",
      icon: Send,
      badgeColor: "bg-red-500 text-white",
      ringColor: "ring-red-100",
    },
    {
      step: 2,
      title: "GPS Captured",
      description: "High-accuracy geolocation telemetry & satellite coordinates are attached instantly.",
      icon: MapPin,
      badgeColor: "bg-blue-500 text-white",
      ringColor: "ring-blue-100",
    },
    {
      step: 3,
      title: "AI Analysis",
      description: "Gemini AI parses natural language & multimodal inputs to determine emergency context.",
      icon: Brain,
      badgeColor: "bg-purple-500 text-white",
      ringColor: "ring-purple-100",
    },
    {
      step: 4,
      title: "Priority Detection",
      description: "Severity rating (Critical, High, Medium, Low) is calculated to prevent backlog delays.",
      icon: AlertTriangle,
      badgeColor: "bg-amber-500 text-white",
      ringColor: "ring-amber-100",
    },
    {
      step: 5,
      title: "Dashboard Updated",
      description: "Command Center live GIS map displays incident & recommends nearest specialized unit.",
      icon: LayoutDashboard,
      badgeColor: "bg-indigo-500 text-white",
      ringColor: "ring-indigo-100",
    },
    {
      step: 6,
      title: "Rescue Team Responds",
      description: "Dispatched units receive turn-by-turn routing telemetry and arrive on scene.",
      icon: Siren,
      badgeColor: "bg-emerald-600 text-white",
      ringColor: "ring-emerald-100",
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-24">
          <span className="px-4 py-1.5 bg-blue-100/80 border border-blue-200 text-blue-700 font-extrabold text-xs uppercase tracking-[0.2em] rounded-full inline-block">
            SYSTEM WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            How RescueAI Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            A 6-step autonomous intelligence pipeline designed to eliminate response latency from signal to dispatch.
          </p>
        </div>

        {/* Timeline Line (Desktop Dotted Connection Line) */}
        <div className="relative">
          <div className="hidden lg:block absolute top-[52px] left-12 right-12 h-0 border-t-2 border-dashed border-slate-300 z-0 opacity-70" />

          {/* 6 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-[24px] p-6 shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-2 transition-all duration-300 flex flex-col items-center h-full">
                    {/* Circle Icon */}
                    <div
                      className={`w-16 h-16 rounded-full ${item.badgeColor} ring-8 ${item.ringColor} flex items-center justify-center font-black text-lg shadow-lg mb-5 group-hover:scale-110 transition-transform`}
                    >
                      <IconComp className="w-7 h-7 text-white" />
                    </div>

                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      STEP 0{item.step}
                    </span>

                    <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mt-auto">
                      {item.description}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="my-3 lg:hidden text-slate-300">
                      <ArrowDown className="w-5 h-5 animate-bounce" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
