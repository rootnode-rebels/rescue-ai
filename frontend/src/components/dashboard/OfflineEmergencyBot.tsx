"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, WifiOff, Wifi, Sparkles, AlertCircle, ShieldAlert, HeartPulse, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isOfflineMode?: boolean;
}

export const OfflineEmergencyBot: React.FC = () => {
  const { userProfile } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Monitor network online/offline status
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Load stored offline chat history
      const saved = localStorage.getItem("rescueai_offline_chats");
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
        } catch (e) {}
      } else {
        setMessages([
          {
            id: "welcome-1",
            sender: "bot",
            text: "Hello! I am your RescueAI Emergency Survival Bot. I function 100% OFFLINE without internet on both Web and Mobile apps. How can I assist your triage or survival safety today?",
            timestamp: new Date().toLocaleTimeString(),
            isOfflineMode: false,
          },
        ]);
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // Save messages to local cache
  const saveMessagesToLocal = (newMsgs: ChatMessage[]) => {
    setMessages(newMsgs);
    if (typeof window !== "undefined") {
      localStorage.setItem("rescueai_offline_chats", JSON.stringify(newMsgs));
    }
  };

  // Local Offline Rules Engine for Disaster Survival Triage
  const processOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("flood") || q.includes("water") || q.includes("drown")) {
      return "[OFFLINE SURVIVAL PROTOCOL - FLOOD]\n1. Move to the highest ground or upper floor immediately. Never stay in a basement.\n2. Turn off main electricity breakers before water reaches outlets.\n3. Do NOT walk or drive through moving flood waters.\n4. Signal for help using a flashlight or bright cloth.\n5. Boil or chemically treat all drinking water.";
    }

    if (q.includes("earthquake") || q.includes("tremor") || q.includes("shaking")) {
      return "[OFFLINE SURVIVAL PROTOCOL - EARTHQUAKE]\n1. DROP to your hands and knees.\n2. COVER your head and neck under a sturdy table or desk.\n3. HOLD ON until shaking stops completely.\n4. Stay away from glass windows, heavy mirrors, and exterior walls.\n5. If outdoors, move to an open area away from power lines and buildings.";
    }

    if (q.includes("fire") || q.includes("smoke") || q.includes("burn")) {
      return "[OFFLINE SURVIVAL PROTOCOL - FIRE]\n1. Stay low and crawl under smoke toward the nearest exit.\n2. Check doors with the back of your hand before touching knobs; never open hot doors.\n3. Stop, Drop, and Roll if clothing catches fire.\n4. Never use elevators during a fire evacuation.";
    }

    if (q.includes("bleed") || q.includes("wound") || q.includes("cut") || q.includes("blood")) {
      return "[OFFLINE FIRST AID PROTOCOL - SEVERE BLEEDING]\n1. Apply firm, continuous direct pressure to the wound with a clean cloth.\n2. Elevate the injured limb above heart level if no bone fracture is suspected.\n3. Do NOT remove saturated bandages; layer new sterile gauze over old ones.\n4. Secure a tight pressure bandage and keep victim calm and warm.";
    }

    if (q.includes("cpr") || q.includes("heart") || q.includes("breath")) {
      return "[OFFLINE FIRST AID PROTOCOL - CPR TRIAGE]\n1. Place victim flat on their back on a firm surface.\n2. Center hands on chest and push hard & fast (100-120 compressions per minute).\n3. Allow complete chest recoil between compressions.\n4. Give 2 rescue breaths for every 30 chest compressions if trained.";
    }

    if (q.includes("shelter") || q.includes("camp") || q.includes("safe zone")) {
      return "[OFFLINE SHELTER FINDER]\nNearby open evacuation relief centers:\n• Central Evacuation Relief Shelter (0.8 mi)\n• St. Jude Community Arena (1.4 mi)\n• North Grid High School Complex (2.1 mi)\nTap the 'Nearby Shelters' tab on your dashboard to reserve your spot offline.";
    }

    return "[OFFLINE EMERGENCY ASSISTANT RESPONSE]\nEmergency protocols active offline. Ensure you:\n1. Keep calm and seek physical shelter.\n2. Press the 1-Click SOS button on your navbar to stream satellite GPS coordinates.\n3. Stay tuned to emergency radio broadcasts or SMS warnings.";
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updated = [...messages, userMsg];
    saveMessagesToLocal(updated);
    const textToProcess = input;
    setInput("");
    setLoading(true);

    if (!isOnline) {
      // Process offline response instantly
      setTimeout(() => {
        const replyText = processOfflineResponse(textToProcess);
        const botMsg: ChatMessage = {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: replyText,
          timestamp: new Date().toLocaleTimeString(),
          isOfflineMode: true,
        };
        saveMessagesToLocal([...updated, botMsg]);
        setLoading(false);
      }, 500);
    } else {
      // Online mode: Call Render Gemini AI backend or fallback
      try {
        const res = await fetch("https://rescueai-backend-3u2o.onrender.com/api/v1/triage/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: textToProcess, location: "Grid Vector" }),
        });

        if (res.ok) {
          const data = await res.json();
          const botMsg: ChatMessage = {
            id: "bot-" + Date.now(),
            sender: "bot",
            text: `[ONLINE GEMINI AI TRIAGE]\nPriority: ${data.priority || "HIGH"}\nCategory: ${data.category || "GENERAL"}\nDirectives: ${data.recommendations || "Proceed to safety."}`,
            timestamp: new Date().toLocaleTimeString(),
            isOfflineMode: false,
          };
          saveMessagesToLocal([...updated, botMsg]);
        } else {
          throw new Error("Backend offline");
        }
      } catch (err) {
        const replyText = processOfflineResponse(textToProcess);
        const botMsg: ChatMessage = {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: replyText,
          timestamp: new Date().toLocaleTimeString(),
          isOfflineMode: true,
        };
        saveMessagesToLocal([...updated, botMsg]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4 max-w-4xl mx-auto flex flex-col h-[600px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>Offline-First Emergency AI Triage Assistant</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-500 font-medium">100% Operational Without Internet (Web &amp; Mobile PWA)</p>
          </div>
        </div>

        {/* Network Online / Offline Status Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1.5 border ${
            isOnline
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
          }`}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
          <span>{isOnline ? "ONLINE GEMINI AI" : "OFFLINE ENGINE ACTIVE"}</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white font-medium shadow-sm"
                  : "bg-slate-50 border border-slate-200 text-slate-800 font-mono"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-75 pb-1 border-b border-black/10">
                <span className="font-bold uppercase">{msg.sender === "user" ? userProfile?.name || "Citizen" : "RescueAI Assistant"}</span>
                <span>{msg.timestamp} {msg.isOfflineMode && "(Offline Mode)"}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono italic p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>Analyzing triage directives...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isOnline ? "Ask triage assistant (flood, bleeding, CPR)..." : "Offline mode active. Type disaster query..."}
          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </motion.div>
  );
};
