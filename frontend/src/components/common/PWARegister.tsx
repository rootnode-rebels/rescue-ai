"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, ShieldAlert } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWARegister: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  useEffect(() => {
    // 1. Register Service Worker for PWA
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("RescueAI Service Worker registered:", reg.scope))
          .catch((err) => console.warn("Service Worker registration failed:", err));
      });
    }

    // 2. Capture Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted RescueAI PWA installation");
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  if (!showInstallBanner || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-red-500/40 rounded-3xl p-5 shadow-2xl shadow-slate-950 text-white font-sans"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight">Install RescueAI App</h4>
              <p className="text-[11px] text-slate-400 font-medium">
                Install directly on your device for instant offline SOS access.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInstallBanner(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleInstallClick}
          className="w-full h-11 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Install App to Home Screen</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
