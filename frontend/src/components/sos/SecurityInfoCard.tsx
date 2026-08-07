"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";

export const SecurityInfoCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-blue-50/80 border border-blue-200 text-blue-900 rounded-3xl p-6 shadow-xs flex items-center gap-4"
    >
      <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shrink-0">
        <Lock className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-black text-blue-950 flex items-center gap-1.5">
          <span>End-to-End Encrypted Telemetry</span>
          <ShieldCheck className="w-4 h-4 text-blue-600" />
        </h4>
        <p className="text-xs text-blue-800 leading-relaxed mt-0.5">
          Your emergency information is encrypted and securely shared only with authorized rescue authorities and emergency operations dispatchers.
        </p>
      </div>
    </motion.div>
  );
};
