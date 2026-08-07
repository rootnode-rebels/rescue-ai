"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight } from "lucide-react";

interface EmergencyButtonProps {
  onClick?: () => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onClick,
  label = "TRIGGER EMERGENCY SOS",
  size = "lg",
  loading = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-12 px-5 text-xs gap-2",
    md: "h-14 px-7 text-sm gap-2.5",
    lg: "h-16 px-9 text-base gap-3",
  };

  return (
    <div className="relative inline-flex items-center justify-center group">
      {/* Outer Pulse Ripple Ring */}
      <span className="absolute -inset-1 bg-red-600/40 rounded-3xl blur-md group-hover:bg-red-600/60 animate-pulse-emergency transition-all pointer-events-none" />

      {/* Button Core */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        disabled={loading}
        className={`relative z-10 font-black tracking-wider uppercase text-white bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl shadow-xl shadow-red-600/40 flex items-center justify-center transition-all border border-red-400/40 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
      >
        {loading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Transmitting SOS...</span>
          </>
        ) : (
          <>
            <div className="p-1 bg-white/20 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span>{label}</span>
            <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>
    </div>
  );
};
