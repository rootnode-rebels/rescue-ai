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
      text: "Hello 👋\nI am your RescueAI Emergency Assistant. I can help you with real-time safety guidance, evacuation steps, nearby shelters, and emergency numbers.",
      timestamp: "Just now",
    },
    {
      id: "2",
      sender: "user",
      text: "What should I do during a flood?",
      timestamp: "Just now",
    },
    {
      id: "3",
      sender: "bot",
      text: "Flood Survival Protocol – Follow these immediate safety steps:",
      timestamp: "Just now",
      steps: [
        "Move to higher ground or upper building floors immediately. Avoid basements and low-lying ground.",
        "Disconnect electrical appliances and main breaker if safe to do so. Never touch electrical equipment in standing water.",
        "Do NOT walk, swim, or drive through flood waters. 6 inches of moving water can knock you down.",
        "Keep your mobile phone charged and enable location permissions for RescueAI satellite dispatch.",
        "If trapped, signal for help using a bright cloth, flashlight, or tap the Red SOS button on RescueAI.",
      ],
      callout: "Emergency Operations Center (EOC) #112 is monitoring Bay Area Sectors 3-8.",
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsTyping(true);

    // Simulate AI Generator
    setTimeout(() => {
      let botReply = "Stay calm! RescueAI is analyzing your location telemetry to provide verified safety protocols.";
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
      } else if (lower.includes("shelter")) {
        botReply = "Evacuation Shelter Status near San Francisco:";
        steps = [
          "Central High School Shelter (0.8 mi) – 65% Full [OPEN]",
          "City Arena Hall (1.4 mi) – 40% Full [OPEN]",
          "North Medical Center (2.1 mi) – 82% Full [OPEN]",
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
      setIsTyping(false);
    }, 900);
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
