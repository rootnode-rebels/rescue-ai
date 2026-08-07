"use client";

import React from "react";
import { Bot } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-4">
      <div className="w-9 h-9 bg-purple-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
        <Bot className="w-5 h-5" />
      </div>
      <div className="bg-white border border-slate-200/80 rounded-3xl rounded-tl-none p-4 shadow-xs flex items-center gap-1.5">
        <span className="text-xs text-slate-500 font-semibold mr-1">RescueAI Assistant is typing</span>
        <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-150" />
        <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-300" />
      </div>
    </div>
  );
};
