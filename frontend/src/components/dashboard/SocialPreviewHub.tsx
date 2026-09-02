"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  Radio,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Download,
  X,
  Camera,
} from "lucide-react";

export const SocialPreviewHub: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<"whatsapp" | "telegram" | "instagram">("whatsapp");
  const [isOpen, setIsOpen] = useState(false);

  const emergencyUrl = "https://rescueai.org";
  const shareText = "🚨 RescueAI Emergency Response Grid: Send 1-tap SOS distress signals, book evacuation shelters, and access offline emergency maps.";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${emergencyUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n" + emergencyUrl)}`;
    window.open(url, "_blank");
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(emergencyUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 uppercase tracking-wider active:scale-95"
      >
        <Share2 className="w-4 h-4 text-white" />
        <span>Social Link Preview &amp; Share</span>
      </button>

      {/* Modal Hub */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-md shadow-emerald-600/30">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Social Link Preview &amp; Emergency Share Hub
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Simulated Live Previews for WhatsApp, Telegram &amp; Instagram
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Platform Selector Tabs */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 border border-slate-200">
                <button
                  onClick={() => setActivePlatform("whatsapp")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    activePlatform === "whatsapp"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => setActivePlatform("telegram")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    activePlatform === "telegram"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-950/20"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </button>
                <button
                  onClick={() => setActivePlatform("instagram")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    activePlatform === "instagram"
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Instagram</span>
                </button>
              </div>

              {/* SIMULATED PREVIEWS */}
              <div className="mb-6">
                {/* 1. WhatsApp Live Link Preview Box */}
                {activePlatform === "whatsapp" && (
                  <div className="bg-[#efeae2] p-4 sm:p-6 rounded-3xl border border-slate-300 font-sans space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">
                      WhatsApp Simulated Message &amp; OG Link Card Preview
                    </span>
                    <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-200/80 max-w-md ml-auto">
                      {/* Rich OG Image Thumbnail */}
                      <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden mb-2 border border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center">
                            <ShieldAlert className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-black tracking-tight">RescueAI Portal</span>
                        </div>
                        <h4 className="text-xs font-bold leading-tight">
                          RescueAI — AI Disaster Response &amp; Emergency Grid
                        </h4>
                        <p className="text-[10px] text-slate-300 mt-1">rescueai.org</p>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {shareText}
                      </p>
                      <a href={emergencyUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 font-bold underline mt-1 block">
                        https://rescueai.org
                      </a>
                      <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">10:42 PM ✓✓</div>
                    </div>
                  </div>
                )}

                {/* 2. Telegram Live Link Preview Box */}
                {activePlatform === "telegram" && (
                  <div className="bg-[#0e1621] p-4 sm:p-6 rounded-3xl border border-slate-800 font-sans space-y-3 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 block mb-1">
                      Telegram Rich Media Preview Card
                    </span>
                    <div className="bg-[#182533] rounded-2xl p-4 border-l-4 border-sky-500 max-w-lg space-y-2 shadow-lg">
                      <span className="text-[11px] font-bold text-sky-400">RescueAI Emergency Dispatch</span>
                      <h4 className="text-sm font-black text-white">
                        RescueAI — National Emergency Response Engine
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {shareText}
                      </p>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-300">{emergencyUrl}</span>
                        <ExternalLink className="w-4 h-4 text-sky-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Instagram Story & Post Preview */}
                {activePlatform === "instagram" && (
                  <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4 sm:p-6 rounded-3xl border border-purple-900/50 text-white space-y-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400 block mb-1">
                      Instagram Story Link &amp; Bio Card Preview
                    </span>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 space-y-3 text-center max-w-sm mx-auto shadow-2xl">
                      <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-red-600/40">
                        <ShieldAlert className="w-10 h-10 animate-pulse" />
                      </div>
                      <h4 className="text-base font-black text-white">RESCUEAI EMERGENCY PORTAL</h4>
                      <p className="text-xs text-slate-200 font-medium">
                        1-Tap Geolocation SOS Broadcast &amp; Evacuation Shelter Reservations
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 font-black text-xs rounded-full shadow-lg">
                        <span>🔗 rescueai.org/sos</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Share Trigger Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {activePlatform === "whatsapp" && (
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Share Directly to WhatsApp</span>
                  </button>
                )}

                {activePlatform === "telegram" && (
                  <button
                    onClick={handleTelegramShare}
                    className="w-full sm:flex-1 py-3 bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4" />
                    <span>Share Directly to Telegram</span>
                  </button>
                )}

                {activePlatform === "instagram" && (
                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Copy Bio Link for Instagram</span>
                  </button>
                )}

                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                  <span>{copied ? "Copied to Clipboard!" : "Copy Portal Link"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
