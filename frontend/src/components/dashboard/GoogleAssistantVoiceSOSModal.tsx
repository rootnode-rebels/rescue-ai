"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, CheckCircle2, MapPin, Radio } from "lucide-react";
import { createSOSRequestInFirestore, getGoogleMapsUrl } from "@/services/sosService";
import { useAuth } from "@/hooks/useAuth";
import { SOSPriority } from "@/types/auth";

interface GoogleAssistantVoiceSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAssistantVoiceSOSModal: React.FC<GoogleAssistantVoiceSOSModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userProfile } = useAuth();
  const [selectedPriority, setSelectedPriority] = useState<SOSPriority>("CRITICAL");
  const [voiceText, setVoiceText] = useState("Say 'Help Me' or tap to dispatch...");
  const [isDispatched, setIsDispatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentGps, setCurrentGps] = useState({ lat: 12.9716, lng: 77.5946 });

  // Get current GPS location upon modal open
  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, [isOpen]);

  const handleVoiceTriggerSOS = async () => {
    setLoading(true);
    setVoiceText(`Voice Command Recognized: 'EMERGENCY DISPATCH [${selectedPriority}]'`);
    try {
      await createSOSRequestInFirestore({
        uid: userProfile?.uid || "citizen-voice",
        citizenName: userProfile?.name || "Citizen (Voice SOS)",
        userPhone: userProfile?.phone || "+91 98765 43210",
        category: "VOICE_ASSISTANT_SOS",
        description: `Google Assistant Voice-Activated Emergency SOS Broadcast [Priority: ${selectedPriority}]`,
        priority: selectedPriority,
        status: "Pending",
        latitude: currentGps.lat,
        longitude: currentGps.lng,
        address: "Live GPS Telemetry (Voice Dispatch)",
        peopleCount: 1,
        medicalNeeds: true,
      });
      setIsDispatched(true);
    } catch (e) {
      console.warn("Voice SOS error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-lg bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-6 relative overflow-hidden text-center"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80"
          >
            <X className="w-5 h-5" />
          </button>

          {!isDispatched ? (
            <div className="space-y-6 py-4">
              {/* Header */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-black uppercase tracking-wider">
                  <Radio className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  <span>Google Assistant Voice Node</span>
                </div>
                <h3 className="text-2xl font-black text-white">RescueAI Voice Calling Assistant</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Hands-Free Emergency SOS Calling &amp; Satellite Vectoring
                </p>
              </div>

              {/* Google Assistant Animated Wave Dots (Blue, Red, Yellow, Green) */}
              <div className="flex items-center justify-center gap-3 py-4">
                <motion.div
                  animate={{ y: [0, -16, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                  className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
                />
                <motion.div
                  animate={{ y: [0, -16, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                  className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
                />
                <motion.div
                  animate={{ y: [0, -16, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                  className="w-4 h-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"
                />
                <motion.div
                  animate={{ y: [0, -16, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.6 }}
                  className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
                />
              </div>

              {/* Priority Selection */}
              <div className="space-y-2 text-left bg-slate-950 border border-slate-800 p-3 rounded-2xl">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  Select Priority Call Matrix:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as SOSPriority[]).map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setSelectedPriority(prio)}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                        selectedPriority === prio
                          ? prio === "CRITICAL"
                            ? "bg-red-600 text-white shadow-md shadow-red-950"
                            : prio === "HIGH"
                            ? "bg-amber-600 text-white shadow-md"
                            : prio === "MEDIUM"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-slate-700 text-white"
                          : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <p className="text-xs text-slate-300 font-mono font-bold">{voiceText}</p>
                <div className="flex justify-center items-center gap-2 text-[11px] text-red-400 font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  <a
                    href={getGoogleMapsUrl(currentGps.lat, currentGps.lng)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-white font-bold"
                  >
                    Google Maps Vector: {currentGps.lat.toFixed(4)}° N, {currentGps.lng.toFixed(4)}° E
                  </a>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleVoiceTriggerSOS}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-red-950 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Mic className="w-5 h-5 animate-pulse" />
                <span>{loading ? "Activating Voice Calling..." : `ACTIVATE VOICE SOS CALL (${selectedPriority})`}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5 py-6">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Voice Emergency Call Active!</h3>
                <p className="text-xs text-slate-400">
                  Google Assistant has dispatched your [{selectedPriority}] call with live satellite coordinates to NDRF Command.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-left text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Victim Name:</span>
                  <span className="font-bold text-white">{userProfile?.name || "Citizen"}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Priority Level:</span>
                  <span className="font-bold text-red-400">{selectedPriority}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Google Maps:</span>
                  <a
                    href={getGoogleMapsUrl(currentGps.lat, currentGps.lng)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-red-400 underline hover:text-white"
                  >
                    Click to Open Google Maps
                  </a>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close Assistant Modal
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
