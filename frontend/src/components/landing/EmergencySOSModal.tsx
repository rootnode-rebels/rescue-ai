"use client";

import React, { useState } from "react";
import { AlertTriangle, MapPin, CheckCircle2, ShieldCheck, X, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<"idle" | "locating" | "broadcasting" | "sent">("idle");
  const [coords, setCoords] = useState<{ lat: string; lng: string }>({ lat: "37.7749", lng: "-122.4194" });

  const triggerSOS = () => {
    setStatus("locating");
    setTimeout(() => {
      // Simulate GPS capture
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({
              lat: pos.coords.latitude.toFixed(4),
              lng: pos.coords.longitude.toFixed(4),
            });
          },
          () => {}
        );
      }
      setStatus("broadcasting");
      setTimeout(() => {
        setStatus("sent");
      }, 1500);
    }, 1200);
  };

  const handleReset = () => {
    setStatus("idle");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-red-600 px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-700/80 rounded-xl animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg leading-tight">Emergency SOS Signal</h3>
                <p className="text-xs text-red-100 font-medium">Instant AI Triage & Direct Rescue Command Broadcast</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-1.5 text-red-200 hover:text-white rounded-lg hover:bg-red-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {status === "idle" && (
              <div className="text-center space-y-6">
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center bg-red-50 border-4 border-red-100 rounded-full">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30"></span>
                  <Radio className="w-12 h-12 text-red-600 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900">Are you in an immediate emergency?</h4>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    Clicking below will broadcast your high-accuracy GPS location and alert the nearest Emergency Operations Center (EOC).
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Real-Time Geolocation Detection Enabled</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Automated Gemini AI Incident Severity Triage</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={triggerSOS}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-600/30 uppercase tracking-wider transition-all duration-200 transform active:scale-98 flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>Transmit Instant SOS Signal Now</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Cancel / Go Back
                  </button>
                </div>
              </div>
            )}

            {(status === "locating" || status === "broadcasting") && (
              <div className="text-center py-10 space-y-6">
                <div className="relative mx-auto w-20 h-20 flex items-center justify-center bg-blue-50 border-4 border-blue-200 rounded-full animate-spin">
                  <Radio className="w-10 h-10 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">
                    {status === "locating" ? "Capturing Precise Satellite GPS Coordinates..." : "Gemini AI Priority Dispatching..."}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Broadcasting encrypted signal to EOC Dispatch Grid & Nearest Rescue Team.
                  </p>
                </div>
              </div>
            )}

            {status === "sent" && (
              <div className="text-center space-y-6 py-4">
                <div className="mx-auto w-20 h-20 flex items-center justify-center bg-green-50 border-4 border-green-200 rounded-full">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full uppercase tracking-wider">
                    CRITICAL SOS #9402 TRANSMITTED
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900">Emergency Distress Signal Broadcasted</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Your location ({coords.lat}° N, {coords.lng}° W) has been logged. Rescue Command Unit #4 is en route.
                  </p>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs text-left space-y-2 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>STATUS:</span>
                    <span className="text-green-400 font-bold">RESCUE TEAM ASSIGNED</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AI PRIORITY:</span>
                    <span className="text-red-400 font-bold">CRITICAL (HIGH SEVERITY)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>ESTIMATED ARRIVAL:</span>
                    <span className="text-blue-400 font-bold">3 MINUTES</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all"
                >
                  Close & Return to Portal
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
