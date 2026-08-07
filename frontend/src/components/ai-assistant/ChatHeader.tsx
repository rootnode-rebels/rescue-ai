"use client";

import React from "react";
import { Bot, Sparkles, MapPin, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ChatHeaderProps {
  onClearChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat }) => {
  const { userProfile } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-8 py-4 flex items-center justify-between shadow-xs">
      {/* Title & Badge */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-600 rounded-2xl text-white shadow-md shadow-purple-600/30 flex items-center justify-center shrink-0">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              AI Emergency Assistant
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-100 text-purple-700 font-mono font-bold text-[10px] rounded-full border border-purple-200">
              <Sparkles className="w-3 h-3 text-purple-600" />
              Powered by RescueAI AI
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            24/7 Real-Time Emergency Survival &amp; Triage Guidance
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium">
          <MapPin className="w-3.5 h-3.5 text-red-600" />
          <span>San Francisco, CA</span>
        </div>

        <button
          onClick={onClearChat}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-red-600 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5"
          title="Reset Conversation"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>

        <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-md">
          {userProfile?.name ? userProfile.name.charAt(0) : "A"}
        </div>
      </div>
    </header>
  );
};
