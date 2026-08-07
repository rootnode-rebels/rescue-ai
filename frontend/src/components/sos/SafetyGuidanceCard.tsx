"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, HeartHandshake } from "lucide-react";

export const SafetyGuidanceCard: React.FC = () => {
  const tips = [
    "Move to higher ground immediately if water is rising.",
    "Keep family and dependents together in one designated safe area.",
    "Avoid electrical wires, breaker panels, and submerged outlets.",
    "Keep essential emergency kit, medication, and IDs accessible.",
    "Maintain mobile phone on low-power mode to preserve battery.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-gray-900">Immediate Survival Guidance</h3>
        </div>
        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-full">
          RECOMMENDED
        </span>
      </div>

      {/* Survival Checklist */}
      <ul className="space-y-2.5 text-xs text-gray-700 font-medium">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>

      {/* Green Success Status Banner */}
      <div className="p-4 bg-emerald-900 text-white rounded-2xl flex items-center gap-3 shadow-md">
        <div className="p-2 bg-emerald-700/80 rounded-xl text-emerald-200">
          <HeartHandshake className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-black text-white">Help is on the way</h4>
          <p className="text-[10px] text-emerald-200">
            Stay calm and keep your location beacon active until responders arrive.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
