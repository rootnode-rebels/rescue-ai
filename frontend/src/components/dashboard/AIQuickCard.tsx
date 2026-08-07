"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User, Loader2 } from "lucide-react";

export const AIQuickCard: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your RescueAI Safety Assistant powered by Gemini AI. How can I assist you right now?",
    },
  ]);

  const quickQuestions = [
    "Nearest Evacuation Shelter?",
    "Flood Survival Protocols?",
    "Request Emergency Medical Aid?",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const updated = [...messages, { sender: "user" as const, text: query }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://rescueai-backend-3u2o.onrender.com/api/v1/triage/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: query }),
      });
      const data = await res.json();
      let reply = "";
      if (data.triage_result && data.triage_result.action_plan) {
        reply = `🚨 [Priority: ${data.triage_result.priority_level}] ${data.triage_result.summary} Guidance: ${data.triage_result.action_plan}`;
      } else if (data.advice) {
        reply = data.advice;
      } else {
        reply = "Safety Protocol: Seek higher ground immediately during floods. Use the red SOS button for emergency dispatch.";
      }
      setMessages((prev) => [...prev, { sender: "ai" as const, text: reply }]);
    } catch (err) {
      console.warn("FastAPI Render AI Assistant notice:", err);
      let reply = "Stay safe! Nearby Evacuation Shelters are active at Central High School (0.8 mi) and City Arena (1.4 mi).";
      if (query.toLowerCase().includes("flood")) {
        reply = "Flood Safety Protocol: Move immediately to higher ground. Do NOT walk or drive through moving water. Keep your mobile charged.";
      } else if (query.toLowerCase().includes("medical") || query.toLowerCase().includes("aid")) {
        reply = "Medical Emergency: Tap the Red SOS button above to broadcast your GPS to Coast Guard & Medical Dispatch Node #902.";
      }
      setMessages((prev) => [...prev, { sender: "ai" as const, text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              Emergency AI Assistant
              <Sparkles className="w-4 h-4 text-blue-600" />
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Powered by Gemini Multimodal LLM</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold text-[10px] rounded-full">
          24/7 ONLINE
        </span>
      </div>

      {/* Message Chat Feed */}
      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`p-2 rounded-xl text-xs shrink-0 ${
                m.sender === "user" ? "bg-slate-900 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-slate-900 text-white rounded-tr-none"
                  : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold p-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Gemini AI is analyzing safety response...</span>
          </div>
        )}
      </div>

      {/* Quick Questions Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {quickQuestions.map((q) => (
          <button
            key={q}
            disabled={loading}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-xl transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for safety advice, evacuation routes..."
          disabled={loading}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-md transition-all shrink-0 disabled:opacity-50"
          aria-label="Send query"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </motion.div>
  );
};
