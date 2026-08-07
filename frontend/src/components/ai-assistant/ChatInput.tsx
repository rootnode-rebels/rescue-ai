"use client";

import React, { useState } from "react";
import { Paperclip, Mic, ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2.5 sm:p-3 flex items-center gap-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all"
    >
      {/* Attachments */}
      <button
        type="button"
        className="p-2 text-slate-400 hover:text-purple-600 rounded-xl hover:bg-slate-100 transition-colors"
        title="Attach File"
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <button
        type="button"
        className="p-2 text-slate-400 hover:text-purple-600 rounded-xl hover:bg-slate-100 transition-colors hidden sm:block"
        title="Voice Input"
      >
        <Mic className="w-5 h-5" />
      </button>

      {/* Input Field */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 300))}
        placeholder="Ask anything about emergency survival, evacuation, or safety..."
        disabled={disabled}
        className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
      />

      <span className="text-[10px] font-mono text-slate-400 hidden md:block">
        {text.length}/300
      </span>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        aria-label="Send Query"
      >
        <ArrowUp className="w-4 h-4 text-white font-bold" />
      </button>
    </form>
  );
};
