"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhoneCall, ShieldCheck, Flame, Phone } from "lucide-react";

export const QuickActionCard: React.FC = () => {
  const helplines = [
    {
      title: "Ambulance",
      number: "108",
      icon: PhoneCall,
      color: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
      numColor: "text-red-600",
    },
    {
      title: "Police",
      number: "100",
      icon: ShieldCheck,
      color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
      numColor: "text-blue-600",
    },
    {
      title: "Fire Dept",
      number: "101",
      icon: Flame,
      color: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
      numColor: "text-amber-600",
    },
    {
      title: "Emergency EOC",
      number: "112",
      icon: Phone,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
      numColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {helplines.map((item, idx) => {
        const IconComp = item.icon;
        return (
          <motion.a
            key={item.title}
            href={`tel:${item.number}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`p-4 rounded-3xl border ${item.color} shadow-xs transition-all duration-200 flex flex-col items-center text-center group`}
          >
            <div className="p-2.5 bg-white rounded-2xl shadow-xs group-hover:scale-110 transition-transform mb-2">
              <IconComp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {item.title}
            </span>
            <span className={`text-xl font-black font-mono tracking-tight ${item.numColor}`}>
              {item.number}
            </span>
          </motion.a>
        );
      })}
    </div>
  );
};
