"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  const chips = [
    "Flood Safety",
    "Earthquake Steps",
    "Fire Survival",
    "Cyclone Alert",
    "Medical Triage",
    "Power Outage",
    "Road Accident",
    "First Aid Tips",
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1 scrollbar-none">
      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1 mr-1">
        <Sparkles className="w-3 h-3 text-purple-600" />
        Quick Topics:
      </span>
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelectPrompt(`What should I do during a ${chip.toLowerCase()}?`)}
          className="px-3 py-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold text-[11px] rounded-full border border-slate-200 hover:border-purple-300 shadow-2xs transition-all shrink-0"
        >
          {chip}
        </button>
      ))}
    </div>
  );
};
