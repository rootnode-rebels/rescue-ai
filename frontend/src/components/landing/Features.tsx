"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Brain,
  MessageSquareHeart,
  LayoutDashboard,
  WifiOff,
  RadioTower,
  ArrowUpRight,
} from "lucide-react";

export const Features: React.FC = () => {
  const features = [
    {
      icon: Flame,
      title: "One Tap SOS",
      description:
        "Instant one-click SOS distress broadcast with high-precision GPS coordinates sent directly to nearby rescue teams and emergency centers.",
      badge: "Instant Trigger",
      badgeColor: "bg-red-50 text-red-600 border-red-200",
      iconColor: "bg-red-600 text-white border-red-600",
      isSos: true,
    },
    {
      icon: Brain,
      title: "AI Priority Detection",
      description:
        "Multimodal Gemini AI automatically triages incoming emergency calls into Critical, High, Medium, and Low severity tiers in real time.",
      badge: "Gemini AI Engine",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      iconColor: "bg-slate-100 text-slate-900 border-slate-200",
      isSos: false,
    },
    {
      icon: MessageSquareHeart,
      title: "Emergency AI Assistant",
      description:
        "Provides 24/7 real-time safety protocols, medical triage guidance, and step-by-step flood & fire survival assistance.",
      badge: "24/7 Safety Guide",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      iconColor: "bg-slate-100 text-slate-900 border-slate-200",
      isSos: false,
    },
    {
      icon: LayoutDashboard,
      title: "Rescue Dashboard",
      description:
        "Real-time emergency monitoring workspace featuring live GPS heatmaps, responder telemetry, and automated unit dispatch.",
      badge: "Command Center",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      iconColor: "bg-slate-100 text-slate-900 border-slate-200",
      isSos: false,
    },
    {
      icon: WifiOff,
      title: "Offline First",
      description:
        "Engineered for disaster zones. Works seamlessly offline using local storage mesh, queuing SOS signals until reconnected.",
      badge: "Mesh Ready",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      iconColor: "bg-slate-100 text-slate-900 border-slate-200",
      isSos: false,
    },
    {
      icon: RadioTower,
      title: "Emergency Operations Center",
      description:
        "Centralized multi-agency command bridge connecting Fire, Coast Guard, Medical, and Police dispatch in a unified view.",
      badge: "Multi-Agency Node",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      iconColor: "bg-slate-100 text-slate-900 border-slate-200",
      isSos: false,
    },
  ];

  return (
    <section id="features" className="py-32 bg-white relative overflow-hidden text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="px-4 py-1.5 bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-xs uppercase tracking-[0.2em] rounded-full inline-block">
            POWERFUL FEATURES
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Everything You Need in a Disaster
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            RescueAI combines AI technology with human compassion to deliver the fastest emergency response.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-[24px] p-8 sm:p-9 shadow-sm hover:shadow-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Circle Icon */}
                    <div className={`w-14 h-14 rounded-full ${feature.iconColor} border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className={`text-xl font-extrabold text-slate-900 ${feature.isSos ? "group-hover:text-red-600" : "group-hover:text-slate-900"} transition-colors flex items-center justify-between`}>
                    <span>{feature.title}</span>
                    <ArrowUpRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${feature.isSos ? "text-red-600" : "text-slate-900"}`} />
                  </h3>

                  <p className="mt-3.5 text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>RescueAI Core Module</span>
                  <span className={`h-2 w-2 rounded-full ${feature.isSos ? "bg-red-600 group-hover:animate-ping" : "bg-slate-400"}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

