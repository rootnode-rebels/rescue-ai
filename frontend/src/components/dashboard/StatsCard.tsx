"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, ShieldCheck, MapPin, Bell, ArrowUpRight } from "lucide-react";

export const StatsCard: React.FC = () => {
  const cards = [
    {
      title: "Active Requests",
      value: "1 Active",
      subtext: "SOS #8492 Dispatching",
      icon: Flame,
      gradient: "from-red-500 to-amber-500",
      accentBg: "bg-red-50 text-red-600 border-red-100",
    },
    {
      title: "Safety Status",
      value: "Safe Zone",
      subtext: "0 Local Threats Logged",
      icon: ShieldCheck,
      gradient: "from-emerald-500 to-green-600",
      accentBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Nearby Shelters",
      value: "8 Open",
      subtext: "Nearest 0.8 Miles Away",
      icon: MapPin,
      gradient: "from-blue-500 to-indigo-600",
      accentBg: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Live Alerts",
      value: "2 Warnings",
      subtext: "Flash Flood Watch Active",
      icon: Bell,
      gradient: "from-purple-500 to-amber-500",
      accentBg: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3.5 rounded-2xl ${card.accentBg} border shadow-xs`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                LIVE STATUS
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">{card.title}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>{card.subtext}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
