"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Server, Flame, Sparkles, Terminal, Map, Smartphone, Palette } from "lucide-react";

export const Technology: React.FC = () => {
  const stack = [
    {
      name: "Next.js 15",
      category: "Frontend Architecture",
      desc: "App Router, SSR, and dynamic React Server Components for sub-second page loads.",
      icon: Cpu,
      color: "bg-slate-900 text-white",
    },
    {
      name: "FastAPI",
      category: "Async Backend",
      desc: "High-concurrency Python 3.12 microservices engine for real-time dispatch telemetry.",
      icon: Server,
      color: "bg-emerald-600 text-white",
    },
    {
      name: "Firebase",
      category: "Auth & Database",
      desc: "Realtime Cloud Firestore synchronization and secure JWT authentication.",
      icon: Flame,
      color: "bg-amber-500 text-white",
    },
    {
      name: "Gemini AI",
      category: "Multimodal Core",
      desc: "Google Gemini LLM for automated triage, severity scoring, and survival guidance.",
      icon: Sparkles,
      color: "bg-blue-600 text-white",
    },
    {
      name: "Ollama",
      category: "Offline Local LLM",
      desc: "Runs local small language models on emergency nodes when internet drops.",
      icon: Terminal,
      color: "bg-indigo-600 text-white",
    },
    {
      name: "Google Maps",
      category: "Geospatial Engine",
      desc: "Interactive GIS mapping, turn-by-turn routing, geocoding, and incident heatmaps.",
      icon: Map,
      color: "bg-red-600 text-white",
    },
    {
      name: "Tailwind CSS",
      category: "Design System",
      desc: "Utility-first CSS with custom emergency design tokens, animations, and dark mode.",
      icon: Palette,
      color: "bg-sky-500 text-white",
    },
    {
      name: "Progressive Web App",
      category: "Disaster Ready",
      desc: "Installable PWA with service worker caching for low-bandwidth disaster survival.",
      icon: Smartphone,
      color: "bg-purple-600 text-white",
    },
  ];

  return (
    <section id="technology" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="px-4 py-1.5 bg-blue-100 border border-blue-200 text-blue-700 font-extrabold text-xs uppercase tracking-[0.2em] rounded-full inline-block">
            PRODUCTION ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Technology Stack
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Built using industry-standard, high-performance frameworks engineered for zero latency and fault tolerance.
          </p>
        </div>

        {/* 8 Tech Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stack.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-2xl rounded-[24px] p-7 shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-md mb-5`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1 mb-2">{item.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
