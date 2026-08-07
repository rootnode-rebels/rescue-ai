"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "emergency" | "warning" | "success" | "info";
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}) => {
  const variantStyles = {
    default: {
      border: "border-gray-100 dark:border-slate-800",
      bg: "bg-white/90 dark:bg-slate-900/90",
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    emergency: {
      border: "border-red-200 dark:border-red-900/60",
      bg: "bg-red-50/50 dark:bg-red-950/30",
      iconBg: "bg-red-600 text-white shadow-md shadow-red-600/30",
    },
    warning: {
      border: "border-amber-200 dark:border-amber-900/60",
      bg: "bg-amber-50/50 dark:bg-amber-950/30",
      iconBg: "bg-amber-500 text-white shadow-md shadow-amber-500/30",
    },
    success: {
      border: "border-emerald-200 dark:border-emerald-900/60",
      bg: "bg-emerald-50/50 dark:bg-emerald-950/30",
      iconBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/30",
    },
    info: {
      border: "border-indigo-200 dark:border-indigo-900/60",
      bg: "bg-indigo-50/50 dark:bg-indigo-950/30",
      iconBg: "bg-indigo-600 text-white shadow-md shadow-indigo-600/30",
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`p-6 rounded-3xl border backdrop-blur-xl shadow-xs transition-all ${style.bg} ${style.border}`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3.5 rounded-2xl ${style.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              trend.isPositive
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-slate-100">
          {value}
        </h3>
        <p className="text-xs font-bold text-gray-600 dark:text-slate-300 mt-1 uppercase tracking-wider">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};
