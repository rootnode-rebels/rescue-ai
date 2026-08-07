"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Clock, ShieldCheck, Activity } from "lucide-react";

export const StatsBar: React.FC = () => {
  const stats = [
    {
      value: "10,000+",
      label: "Citizens Protected",
      icon: Users,
      badgeStyle: "bg-red-100 text-red-600 border-red-200",
    },
    {
      value: "2 Minutes",
      label: "Average Response Time",
      icon: Clock,
      badgeStyle: "bg-blue-100 text-blue-600 border-blue-200",
    },
    {
      value: "500+",
      label: "Rescue Teams",
      icon: ShieldCheck,
      badgeStyle: "bg-emerald-100 text-emerald-600 border-emerald-200",
    },
    {
      value: "99%",
      label: "System Availability",
      icon: Activity,
      badgeStyle: "bg-amber-100 text-amber-600 border-amber-200",
    },
  ];

  return (
    <section className="relative z-30 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-16 lg:-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-[24px] p-8 sm:p-10 shadow-2xl shadow-slate-900/15 border border-slate-100/80 backdrop-blur-md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-5 ${idx !== 0 ? "sm:pl-6 pt-6 sm:pt-0" : ""}`}
              >
                {/* Circle Icon */}
                <div className={`w-14 h-14 rounded-full ${stat.badgeStyle} border flex items-center justify-center shrink-0 shadow-sm`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
