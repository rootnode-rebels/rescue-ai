"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, AlertCircle, Clock, Activity } from "lucide-react";

interface AIAnalysisCardProps {
  emergencyType?: string;
  peopleAffected?: number;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  emergencyType = "Flood",
  peopleAffected = 1,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
              AI Emergency Analysis
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            </h3>
            <p className="text-[11px] text-gray-500 font-medium">Multimodal Gemini Triage Engine</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-mono font-bold text-[10px] rounded-full uppercase border border-red-200">
          HIGH PRIORITY
        </span>
      </div>

      {/* Grid of AI Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 bg-red-50/60 border border-red-100 rounded-2xl">
          <span className="text-[10px] text-red-500 font-bold uppercase block">Priority Level</span>
          <span className="text-red-700 font-black text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-red-600" />
            CRITICAL
          </span>
        </div>

        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl">
          <span className="text-[10px] text-blue-500 font-bold uppercase block">ETA Response</span>
          <span className="text-blue-700 font-black text-sm flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-600" />
            8 Minutes
          </span>
        </div>
      </div>

      {/* Severity Progress Meter Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-red-600" />
            Severity Score:
          </span>
          <span className="font-mono font-black text-red-600">4.2 / 5.0 (High Threat)</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "84%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full shadow-xs"
          />
        </div>
      </div>

      {/* Detected Summary */}
      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs space-y-1">
        <div className="flex items-center justify-between text-gray-600 font-medium">
          <span>Detected Type: <strong className="text-gray-900 font-bold">{emergencyType}</strong></span>
          <span>Trapped: <strong className="text-gray-900 font-bold">{peopleAffected} Person(s)</strong></span>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed pt-1 border-t border-gray-200/60">
          Auto-dispatched to nearest available unit (Coast Guard Rescue Squad #4).
        </p>
      </div>
    </motion.div>
  );
};
