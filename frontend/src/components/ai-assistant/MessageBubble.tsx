"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, User, ShieldAlert } from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  steps?: string[];
  callout?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 my-4 ${!isBot ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md font-bold text-xs ${
          isBot ? "bg-purple-600 text-white" : "bg-red-600 text-white"
        }`}
      >
        {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Message Card */}
      <div
        className={`max-w-[88%] sm:max-w-[78%] rounded-3xl p-5 shadow-xs text-sm leading-relaxed ${
          isBot
            ? "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
            : "bg-red-600 text-white rounded-tr-none shadow-red-600/20"
        }`}
      >
        <p className="whitespace-pre-line font-normal">{message.text}</p>

        {/* Numbered Steps if provided */}
        {message.steps && message.steps.length > 0 && (
          <div className="mt-4 space-y-2.5 pt-3 border-t border-slate-100">
            {message.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
                  {step}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Callout Notice if provided */}
        {message.callout && (
          <div className="mt-3 p-3 bg-red-50 text-red-800 rounded-2xl border border-red-200 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{message.callout}</span>
          </div>
        )}

        <div
          className={`text-[10px] font-mono mt-2.5 flex items-center gap-1 ${
            isBot ? "text-slate-400" : "text-red-100 justify-end"
          }`}
        >
          <span>{message.timestamp}</span>
          {isBot && <span>• Verified Protocol</span>}
        </div>
      </div>
    </motion.div>
  );
};
