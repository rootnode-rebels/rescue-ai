"use client";

import React from "react";
import { motion } from "framer-motion";
import { Radio, Shield, CheckCircle, Clock } from "lucide-react";

export const Statistics: React.FC = () => {
  const metrics = [
    {
      number: "5,000+",
      label: "Emergency Requests Handled",
      detail: "Processed by AI Triage Engine",
      icon: Radio,
    },
    {
      number: "100+",
      label: "Rescue Teams Coordinated",
      detail: "Multi-Agency First Responders",
      icon: Shield,
    },
    {
      number: "98%",
      label: "Successful Coordination Rate",
      detail: "Optimal Route & Dispatch Accuracy",
      icon: CheckCircle,
    },
    {
      number: "24/7",
      label: "Continuous Availability",
      detail: "Fault-Tolerant Redundant Infrastructure",
      icon: Clock,
    },
  ];

  return (
    <section id="impact" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider rounded-full inline-block">
            Proven Performance Metrics
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Impact &amp; System Reliability
          </h2>
          <p className="text-sm text-slate-400">
            Real-world metrics demonstrating swift disaster intervention and multi-agency efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 text-center hover:border-red-500/50 hover:bg-slate-800 transition-all duration-300 shadow-xl"
              >
                <div className="inline-flex p-3 bg-red-500/20 text-red-400 rounded-2xl mb-4 border border-red-500/30">
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
                  {item.number}
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-1">{item.label}</h3>
                <p className="text-xs text-slate-400">{item.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
