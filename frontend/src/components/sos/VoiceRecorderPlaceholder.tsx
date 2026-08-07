"use client";

import React, { useState, useEffect } from "react";
import { Mic, Square, Check, Volume2 } from "lucide-react";

export const VoiceRecorderPlaceholder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setHasRecorded(false);
      setIsRecording(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Voice Message / Audio Note (Optional)
      </label>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center ${
              isRecording
                ? "bg-red-600 text-white animate-pulse shadow-red-600/40"
                : hasRecorded
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600"
            }`}
            aria-label={isRecording ? "Stop Recording" : "Start Voice Recording"}
          >
            {isRecording ? (
              <Square className="w-5 h-5 fill-current" />
            ) : hasRecorded ? (
              <Check className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <div>
            <span className="text-xs font-black text-gray-900 block">
              {isRecording
                ? "Recording Audio Note..."
                : hasRecorded
                ? "Voice Note Recorded"
                : "Record Voice Distress Note"}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">
              {isRecording
                ? `Duration: ${formatTime(timer)}`
                : hasRecorded
                ? "00:14 • Ready for AI Triage"
                : "Tap microphone to start"}
            </span>
          </div>
        </div>

        {/* Equalizer Wave Animation while recording */}
        {isRecording ? (
          <div className="flex items-center gap-1 h-6 px-3 bg-red-100/80 rounded-xl border border-red-200">
            <div className="w-1 h-4 bg-red-600 rounded-full animate-pulse" />
            <div className="w-1 h-6 bg-red-600 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-3 bg-red-600 rounded-full animate-pulse delay-150" />
            <div className="w-1 h-5 bg-red-600 rounded-full animate-pulse delay-100" />
          </div>
        ) : hasRecorded ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 font-mono text-xs rounded-xl border border-emerald-200">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Audio Ready</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
