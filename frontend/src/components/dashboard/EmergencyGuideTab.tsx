"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, CheckCircle2, Flame, Droplet, Zap, HeartPulse, AlertCircle, Shield } from "lucide-react";

export const EmergencyGuideTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const guides = [
    {
      id: "guide-flood",
      title: "Flash Flood Survival Protocol",
      category: "FLOOD",
      icon: Droplet,
      iconColor: "text-blue-600 bg-blue-50 border-blue-100",
      summary: "Immediate steps to take during sudden urban or river flooding.",
      steps: [
        "Move to higher ground or upper floor immediately. Never stay in a basement.",
        "Do NOT walk, swim, or drive through moving flood waters.",
        "Turn off main electricity breakers if safe to do so before water rises.",
        "Signal for help using bright cloth, flashlight, or the RescueAI SOS button.",
      ],
    },
    {
      id: "guide-earthquake",
      title: "Earthquake Drop, Cover & Hold On Protocol",
      category: "EARTHQUAKE",
      icon: Zap,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
      summary: "Essential protection maneuvers during seismic tremors.",
      steps: [
        "DROP onto your hands and knees immediately.",
        "COVER your head and neck under a sturdy table or desk.",
        "HOLD ON to your shelter until shaking stops completely.",
        "Stay away from glass windows, heavy furniture, and exterior walls.",
      ],
    },
    {
      id: "guide-fire",
      title: "Structure Fire Evacuation Protocol",
      category: "FIRE",
      icon: Flame,
      iconColor: "text-red-600 bg-red-50 border-red-100",
      summary: "Rapid evacuation procedures for building fires.",
      steps: [
        "Get low and crawl under smoke toward the nearest marked emergency exit.",
        "Touch doors with the back of your hand before opening; do NOT open hot doors.",
        "Never use elevators during a fire evacuation.",
        "Once outside, stay at the designated assembly point and notify first responders.",
      ],
    },
    {
      id: "guide-medical",
      title: "First Aid & Medical Triage Protocol",
      category: "MEDICAL",
      icon: HeartPulse,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      summary: "First responder triage and hemorrhage control steps.",
      steps: [
        "Check scene safety before approaching injured victims.",
        "Apply direct pressure with clean cloth to severe bleeding wounds.",
        "Keep unconscious victims on their side in the recovery position.",
        "Use the RescueAI SOS button to broadcast GPS to nearby Paramedic Units.",
      ],
    },
  ];

  const filteredGuides = guides.filter((g) => {
    const matchesCategory = activeCategory === "ALL" || g.category === activeCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">National Emergency Survival Protocols</h3>
            <p className="text-xs text-slate-500 font-medium">Standard First-Responder Guidelines &amp; Disaster Checklists</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search protocols (flood, fire)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "FLOOD", "EARTHQUAKE", "FIRE", "MEDICAL"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-md shadow-blue-950"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGuides.map((guide) => {
          const IconComp = guide.icon;
          return (
            <div
              key={guide.id}
              className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${guide.iconColor}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">{guide.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{guide.summary}</p>
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-200/60">
                {guide.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
