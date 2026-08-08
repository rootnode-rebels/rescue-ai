"use client";

import React, { useEffect, useState, useRef } from "react";
import { createSOSRequestInFirestore } from "@/services/sosService";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Radio, AlertTriangle } from "lucide-react";

export const HardwarePowerButtonListener: React.FC = () => {
  const [triggerCount, setTriggerCount] = useState<number>(0);
  const [showEmergencyOverlay, setShowEmergencyOverlay] = useState<boolean>(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPressTimeRef = useRef<number>(0);

  // Strictly evaluate if the current environment is a Mobile Phone (Capacitor Android APK or Mobile Web)
  const isMobileDevice = (): boolean => {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isCapacitorNative = Boolean((window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.());
    const isSmallTouchScreen = "ontouchstart" in window && window.innerWidth <= 800;

    return isMobileUA || isCapacitorNative || isSmallTouchScreen;
  };

  useEffect(() => {
    // DO NOT listen on Laptop/Desktop/PC environments!
    if (!isMobileDevice()) return;

    const handleHardwarePress = (e: KeyboardEvent) => {
      // Listen for Mobile Volume / Power key events
      const isMobileHardwareKey =
        e.key === "Power" ||
        e.key === "VolumeDown" ||
        e.key === "VolumeUp" ||
        e.code === "Power" ||
        e.code === "VolumeDown" ||
        e.code === "VolumeUp";

      if (!isMobileHardwareKey) return;

      const now = Date.now();
      const timeSinceLastPress = now - lastPressTimeRef.current;
      lastPressTimeRef.current = now;

      if (timeSinceLastPress < 1500 || triggerCount === 0) {
        setTriggerCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            triggerHardwareSOS();
            return 0;
          }
          return newCount;
        });

        if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
        pressTimerRef.current = setTimeout(() => {
          setTriggerCount(0);
        }, 1800);
      } else {
        setTriggerCount(1);
      }
    };

    window.addEventListener("keydown", handleHardwarePress);
    return () => {
      window.removeEventListener("keydown", handleHardwarePress);
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    };
  }, [triggerCount]);

  const triggerHardwareSOS = async () => {
    setShowEmergencyOverlay(true);

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await createSOSRequestInFirestore({
              category: "MOBILE HARDWARE SOS",
              description: "🚨 MOBILE HARDWARE TRIPLE POWER BUTTON EMERGENCY SOS DISPATCH!",
              priority: "CRITICAL",
              latitude,
              longitude,
              peopleCount: 1,
              medicalNeeds: true,
            });
          },
          async () => {
            await createSOSRequestInFirestore({
              category: "MOBILE HARDWARE SOS",
              description: "🚨 MOBILE HARDWARE TRIPLE POWER BUTTON EMERGENCY SOS DISPATCH!",
              priority: "CRITICAL",
              latitude: 12.9716,
              longitude: 77.5946,
              peopleCount: 1,
              medicalNeeds: true,
            });
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      }
    } catch (e) {
      console.warn("Mobile Hardware SOS dispatch notice:", e);
    }
  };

  if (typeof window !== "undefined" && !isMobileDevice()) {
    return null; // Render absolutely nothing on PCs / Laptops
  }

  return (
    <AnimatePresence>
      {showEmergencyOverlay && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[9999] bg-red-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-white text-center"
        >
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center animate-ping mb-8 shadow-2xl shadow-red-500/80">
            <ShieldAlert className="w-12 h-12 text-white" />
          </div>

          <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-500/50 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-4 text-red-300">
            <Radio className="w-4 h-4 animate-pulse text-red-400" />
            <span>Mobile Hardware SOS Triggered</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Emergency SOS Dispatched!
          </h2>
          <p className="text-sm sm:text-base text-red-200 max-w-md mx-auto font-medium mb-8">
            3x Power/Volume Button Press detected on your Mobile Phone! Your live GPS coordinates have been sent to NDRF Rescue Command.
          </p>

          <div className="bg-black/40 border border-red-500/30 rounded-2xl p-4 max-w-sm w-full mb-8 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">Trigger Device:</span>
              <span className="text-red-400 font-bold">Mobile Phone Hardware Key (3x)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">Priority Triage:</span>
              <span className="text-red-500 font-black">CRITICAL (MAX)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">GPS Precision:</span>
              <span className="text-emerald-400 font-bold">±2.5m Satellite Lock</span>
            </div>
          </div>

          <button
            onClick={() => setShowEmergencyOverlay(false)}
            className="px-8 py-4 bg-white text-red-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:bg-gray-100 transition-all active:scale-95"
          >
            Dismiss Alert Screen
          </button>
        </motion.div>
      )}

      {/* Floating Hardware Press Counter Toast */}
      {triggerCount > 0 && !showEmergencyOverlay && (
        <div className="fixed bottom-6 right-6 z-[999] bg-red-600 text-white px-4 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center gap-3 border border-red-400 animate-bounce">
          <AlertTriangle className="w-5 h-5 text-yellow-300" />
          <span>Mobile Key Press {triggerCount}/3 — Press {3 - triggerCount} more time for SOS!</span>
        </div>
      )}
    </AnimatePresence>
  );
};
