"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Send, Radio, ShieldCheck, WifiOff } from "lucide-react";
import { OfflineEmergencyBot } from "./OfflineEmergencyBot";

export const AIQuickCard: React.FC = () => {
  return (
    <div className="space-y-4">
      <OfflineEmergencyBot />
    </div>
  );
};
