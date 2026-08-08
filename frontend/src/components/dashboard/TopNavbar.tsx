"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Bell, Radio, LogOut, Flame, Mic, Lightbulb } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EmergencySOSModal } from "../landing/EmergencySOSModal";
import { GoogleAssistantVoiceSOSModal } from "./GoogleAssistantVoiceSOSModal";
import { getGoogleMapsUrl } from "@/services/sosService";
import { useTheme } from "@/context/ThemeContext";

export const TopNavbar: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Live Current GPS State
  const [currentGps, setCurrentGps] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: 12.9716,
    lng: 77.5946,
    accuracy: 2.5,
  });

  // Watch position in real time for 99.99% pinpoint live telemetry
  useEffect(() => {
    let watchId: number | null = null;
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentGps({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy || 2.5,
          });
        },
        () => {},
        { enableHighAccuracy: true }
      );

      try {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            setCurrentGps({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy || 2.5,
            });
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
      } catch (e) {}
    }

    return () => {
      if (watchId !== null && typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const notifications = [
    { id: 1, title: "Weather Alert Issued", desc: "Flood Warning in Sector 4 until 8 PM", time: "10m ago", type: "warning" },
    { id: 2, title: "Rescue Team Dispatched", desc: "Coast Guard Unit #4 en route to nearby harbor", time: "25m ago", type: "info" },
    { id: 3, title: "Shelter Capacity Update", desc: "Central High Shelter at 65% capacity", time: "1h ago", type: "success" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-6 lg:px-8 py-4 flex items-center justify-between shadow-xs font-sans transition-colors duration-300 ${
        theme === "light" ? "bg-white/90 border-slate-200 text-slate-900" : "bg-slate-900/90 border-slate-800 text-white"
      }`}>
        {/* Left: Greeting & Current Location Telemetry */}
        <div>
          <h1 className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 ${
            theme === "light" ? "text-slate-900" : "text-white"
          }`}>
            Hello, {userProfile?.name || "Citizen"} 👋
          </h1>

          {/* LIVE CURRENT GPS TELEMETRY BADGE FOR ALL DASHBOARDS */}
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Telemetry: {currentGps.lat.toFixed(4)}° N, {currentGps.lng.toFixed(4)}° E (±{currentGps.accuracy.toFixed(1)}m)
            </span>
          </div>
        </div>

        {/* Right Controls: Voice Call Assistant, SOS Button, Bulb Theme Switcher, Google Maps, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* GOOGLE ASSISTANT VOICE CALLING SOS BUTTON */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 rounded-2xl font-extrabold text-xs shadow-md flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            title="Google Assistant Voice Calling SOS"
          >
            <Mic className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="hidden sm:inline">Voice Assistant SOS</span>
          </button>

          {/* ULTRA-MODERN HIGHLIGHTED SOS BUTTON */}
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 border border-red-400/30 uppercase tracking-wider"
          >
            <Flame className="w-4 h-4 text-white animate-bounce" />
            <span>DISPATCH SOS</span>
          </button>

          {/* BULB LIGHT / DARK THEME SLIDER */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 ${
              theme === "light"
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : "bg-slate-800 text-amber-300 border-slate-700"
            }`}
            title="Switch Theme (Light/Dark Bulb Slider)"
          >
            <Lightbulb className="w-5 h-5 animate-pulse text-amber-400" />
            <span className="text-xs font-bold hidden md:inline">
              {theme === "light" ? "Light" : "Dark"}
            </span>
          </button>

          {/* DIRECT GOOGLE MAPS LOCATION LINK */}
          <a
            href={getGoogleMapsUrl(currentGps.lat, currentGps.lng)}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-2xl text-xs font-bold transition-all"
            title="Open Live Google Maps Location Link"
          >
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Google Maps</span>
          </a>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 bg-slate-800/60 hover:bg-slate-700 text-slate-300 rounded-2xl transition-colors focus:outline-none"
              aria-label="View Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-red-600 animate-spin" />
                    Live Emergency Alerts
                  </span>
                  <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 font-bold px-2 py-0.5 rounded-full">
                    3 NEW
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-xs font-extrabold text-white">
                        <span>{n.title}</span>
                        <span className="text-[10px] font-normal text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-400">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar Badge */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="w-10 h-10 bg-red-600 text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-md">
              {userProfile?.name ? userProfile.name.charAt(0) : "C"}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2.5 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-2xl border border-red-800/60 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
              title="Sign Out of RescueAI"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Emergency SOS Modal */}
      <EmergencySOSModal isOpen={isSosModalOpen} onClose={() => setIsSosModalOpen(false)} />

      {/* Google Assistant Voice SOS Modal */}
      <GoogleAssistantVoiceSOSModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
    </>
  );
};
