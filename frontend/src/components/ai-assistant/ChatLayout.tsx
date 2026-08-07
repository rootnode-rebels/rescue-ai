"use client";

import React, { useState } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble, ChatMessage } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyChat } from "./EmptyChat";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ChatInput } from "./ChatInput";
import { QuickQuestions } from "./QuickQuestions";
import { AIStatusCard } from "./AIStatusCard";
import { EmergencyResources } from "./EmergencyResources";

export const ChatLayout: React.FC = () => {
  const initialMessages: ChatMessage[] = [
    {
      id: "1",
      sender: "bot",
      text: "Hello 👋\nI am your RescueAI Emergency Assistant powered by Google Gemini 1.5. Ask me for real-time flood, fire, or earthquake survival protocols, nearby shelter status, or emergency medical guidance.",
      timestamp: "Just now",
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "https://rescueai-backend-3u2o.onrender.com/api";
      const response = await fetch(`${backendUrl}/triage/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `[Priority Level: ${data.priority || "HIGH"}] — ${data.summary}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          steps: data.survival_guidance && data.survival_guidance.length > 0
            ? data.survival_guidance
            : [
                "Move to higher ground immediately if in a flood zone.",
                "Keep mobile phone charged and enable location telemetry for RescueAI.",
                "If trapped, tap the Emergency SOS button in your RescueAI app.",
              ],
          callout: `Emergency Category: ${data.category || "GENERAL"} | Recommended Action: ${data.recommended_action || "Dispatch Nearest Unit"}`,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("FastAPI Triage response error");
      }
    } catch (err) {
      console.warn("FastAPI offline fallback:", err);
      let botReply = "Stay calm! RescueAI is analyzing your input to provide verified safety protocols.";
      let steps: string[] | undefined = undefined;
      let callout: string | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes("earthquake")) {
        botReply = "Earthquake Survival Guidelines – Drop, Cover, and Hold On:";
        steps = [
          "DROP onto your hands and knees to prevent being knocked over.",
          "COVER your head and neck under a sturdy table or desk.",
          "HOLD ON to your shelter until shaking completely stops.",
          "If outdoors, move away from buildings, streetlights, and utility wires.",
        ];
        callout = "Avoid elevators after an earthquake until safety checks complete.";
      } else if (lower.includes("fire")) {
        botReply = "Fire Safety & Evacuation Protocol:";
        steps = [
          "Get low under smoke and crawl to the nearest safe exit.",
          "Feel doors before opening – if hot, use an alternate escape route.",
          "Call Fire Department immediately at 101.",
        ];
      } else {
        botReply = "Emergency Response Protocol:";
        steps = [
          "Move to a safe, elevated location away from immediate danger.",
          "Maintain contact with local emergency authorities via #112.",
          "Keep your RescueAI app open for live GPS tracking.",
        ];
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        steps,
        callout,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-500 selection:text-white">
      {/* Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header */}
        <ChatHeader onClearChat={handleClearChat} />

        {/* Main 2-Column Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Conversation Feed */}
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <EmptyChat onSelectPrompt={handleSendMessage} />
            ) : (
              <div className="max-w-4xl w-full mx-auto space-y-4 pb-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            )}

            {/* Bottom Fixed Input & Chip Bar */}
            <div className="max-w-4xl w-full mx-auto space-y-2 pt-2 bg-slate-50">
              <SuggestedPrompts onSelectPrompt={handleSendMessage} />
              <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
            </div>
          </div>

          {/* Right Information Panel (Hidden on Mobile) */}
          <div className="hidden xl:block w-80 p-6 bg-slate-100/60 border-l border-slate-200/80 overflow-y-auto space-y-6">
            <AIStatusCard />
            <QuickQuestions onSelectQuestion={handleSendMessage} />
            <EmergencyResources />
          </div>
        </div>
      </div>
    </div>
  );
};
