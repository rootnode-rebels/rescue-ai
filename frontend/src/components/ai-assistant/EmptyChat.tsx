"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Shield, Flame, Activity, Zap } from "lucide-react";

interface EmptyChatProps {
  onSelectPrompt: (prompt: string) => void;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({ onSelectPrompt }) => {
  const starterPrompts = [
    {
      title: "What to do during a flood?",
      category: "Natural Disaster",
      icon: Flame,
    },
    {
      title: "How to survive an earthquake?",
      category: "Seismic Safety",
      icon: Activity,
    },
    {
      title: "Where is the nearest shelter?",
      category: "Evacuation",
      icon: Shield,
    },
    {
      title: "First aid for severe burns?",
      category: "Medical Triage",
      icon: Zap,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-6 max-w-2xl mx-auto my-auto"
    >
      {/* Glowing AI Icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-purple-600/30 blur-2xl animate-pulse" />
        <div className="relative w-20 h-20 bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 rounded-3xl text-white flex items-center justify-center shadow-2xl shadow-purple-600/40">
          <Bot className="w-10 h-10 animate-bounce" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center justify-center gap-2">
          Ask RescueAI Anything
          <Sparkles className="w-6 h-6 text-purple-600" />
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
          Get real-time emergency guidance, evacuation protocols, and medical triage steps powered by Gemini AI.
        </p>
      </div>

      {/* Starter Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
        {starterPrompts.map((p) => {
          const IconComp = p.icon;
          return (
            <button
              key={p.title}
              onClick={() => onSelectPrompt(p.title)}
              className="p-4 bg-white hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-300 rounded-2xl shadow-xs transition-all text-left group flex items-start gap-3"
            >
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform shrink-0">
                <IconComp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 block">
                  {p.category}
                </span>
                <span className="text-xs font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                  {p.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
