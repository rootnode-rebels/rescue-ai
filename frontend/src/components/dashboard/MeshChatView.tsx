"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bluetooth, Send, PhoneCall, RadioTower } from "lucide-react";

export const MeshChatView: React.FC = () => {
  const [messages, setMessages] = useState<{ id: number; text: string; sender: string; isSelf: boolean }[]>([
    { id: 1, text: "Anyone receiving this on local Bluetooth?", sender: "Nearby Device (30m)", isSelf: false },
    { id: 2, text: "Yes, loud and clear. We are heading to the North Grid shelter.", sender: "Local Node B", isSelf: false },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: "You", isSelf: true }]);
    setInput("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6 max-w-4xl mx-auto h-[600px] flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-2xl text-purple-700">
            <Bluetooth className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">RescueAI Offline Mesh Chat</h3>
            <p className="text-xs text-slate-500 font-medium">Peer-to-Peer Bluetooth & Wi-Fi Direct Network</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5">
            <RadioTower className="w-3 h-3" />
            <span>3 Nodes Connected</span>
          </div>
          <button className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl transition-colors" title="Start PTT Walkie-Talkie">
            <PhoneCall className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 p-2 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isSelf ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${msg.isSelf ? "bg-purple-600 text-white rounded-br-none" : "bg-slate-100 text-slate-800 rounded-bl-none"}`}>
              <div className="text-[9px] font-bold opacity-70 uppercase tracking-wider">{msg.sender}</div>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-100">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Send message via Bluetooth Mesh..." className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500" />
        <button type="submit" disabled={!input.trim()} className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-md uppercase disabled:opacity-50 flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </motion.div>
  );
};
