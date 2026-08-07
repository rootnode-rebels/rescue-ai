"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Share2, ShieldAlert, Check } from "lucide-react";

export const FooterCTA: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("https://rescueai.org");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="p-3.5 bg-red-600/30 text-red-400 rounded-2xl border border-red-500/40 shrink-0">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Together We Can Save More Lives
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
            Share RescueAI with family, neighbors, and community groups to expand zero-latency emergency coverage.
          </p>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="w-full sm:w-auto px-7 py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wider shrink-0"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-white" />
            <span>Link Copied to Clipboard!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-white" />
            <span>Share RescueAI Platform</span>
          </>
        )}
      </button>
    </motion.div>
  );
};
