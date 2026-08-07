"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Bell, ShieldCheck, Radio, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const TopNavbar: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-8 py-4 flex items-center justify-between shadow-xs font-sans">
      {/* Left: Greeting & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Hello, {userProfile?.name || "Akash"} 👋
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Stay safe. RescueAI is actively monitoring your sector.
        </p>
      </div>

      {/* Right: Location Badge, Notifications, Profile Avatar & Logout */}
      <div className="flex items-center gap-4">
        {/* Current Location Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-slate-100/80 border border-slate-200 text-slate-700 rounded-2xl text-xs font-semibold">
          <MapPin className="w-4 h-4 text-red-600 animate-pulse" />
          <span>San Francisco, CA (37.7749° N, 122.4194° W)</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-2xl transition-colors focus:outline-none"
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
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-red-600 animate-spin" />
                  Live Emergency Alerts
                </span>
                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                  3 NEW
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                      <span>{n.title}</span>
                      <span className="text-[10px] font-normal text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-md">
            {userProfile?.name ? userProfile.name.charAt(0) : "A"}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-extrabold text-slate-900 leading-tight">
              {userProfile?.name || "Akash R."}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {userProfile?.role?.toUpperCase() || "CITIZEN"} • Active
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl border border-red-200 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
            title="Sign Out of RescueAI"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
