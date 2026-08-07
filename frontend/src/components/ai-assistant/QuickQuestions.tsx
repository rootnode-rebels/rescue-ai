"use client";

import React from "react";
import { HelpCircle, Flame, Activity, Shield, Zap, AlertTriangle, ArrowRight } from "lucide-react";

interface QuickQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

export const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onSelectQuestion }) => {
  const questions = [
    {
      title: "What should I do in a flood?",
      icon: Flame,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "How to survive an earthquake?",
      icon: Activity,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Where is the nearest shelter?",
      icon: Shield,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Emergency kit checklist?",
      icon: Zap,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Medical emergency steps?",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600 border-red-100",
    },
    {
      title: "Fire safety tips?",
      icon: HelpCircle,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900">Quick Questions</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">TAP TO ASK</span>
      </div>

      <div className="space-y-2.5">
        {questions.map((q) => {
          const IconComp = q.icon;
          return (
            <button
              key={q.title}
              onClick={() => onSelectQuestion(q.title)}
              className="w-full p-3 bg-slate-50 hover:bg-purple-50/60 border border-slate-200/80 hover:border-purple-300 rounded-2xl transition-all text-left group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${q.color} shrink-0 group-hover:scale-105 transition-transform`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  {q.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
