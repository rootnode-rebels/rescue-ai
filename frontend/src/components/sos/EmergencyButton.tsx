"use client";

import React, { useState } from "react";
import { Flame, ArrowRight, CheckCircle2 } from "lucide-react";

interface EmergencyButtonProps {
  onSendAlert: () => void;
  disabled?: boolean;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onSendAlert, disabled }) => {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleClick = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      onSendAlert();
      setTimeout(() => setSentSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isSending}
        className={`w-full h-16 rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
          sentSuccess
            ? "bg-emerald-600 text-white shadow-emerald-600/40"
            : "bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-600/50 hover:shadow-red-600/70 hover:-translate-y-0.5 active:scale-[0.99]"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSending ? (
          <>
            <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
            <span>TRANSMITTING EMERGENCY ALERT...</span>
          </>
        ) : sentSuccess ? (
          <>
            <CheckCircle2 className="w-6 h-6 text-white animate-bounce" />
            <span>EMERGENCY ALERT DISPATCHED!</span>
          </>
        ) : (
          <>
            <Flame className="w-6 h-6 text-white animate-pulse" />
            <span>SEND SOS ALERT</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </>
        )}
      </button>
      <p className="text-[11px] text-center font-semibold text-gray-500">
        Emergency signal immediately broadcasts to Coast Guard, Fire, Police, and Medical Dispatchers.
      </p>
    </div>
  );
};
