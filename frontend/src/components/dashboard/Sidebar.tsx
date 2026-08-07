"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  Flame,
  Bot,
  MapPin,
  FileText,
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "SOS & Help", href: "/dashboard/sos", icon: Flame },
    { name: "AI Assistant", href: "#ai-assistant", icon: Bot },
    { name: "Nearby Shelters", href: "#shelters", icon: MapPin },
    { name: "My Requests", href: "#my-requests", icon: FileText },
    { name: "Emergency Guide", href: "#guide", icon: BookOpen },
    { name: "Live Alerts", href: "#alerts", icon: Bell },
    { name: "Profile", href: "#profile", icon: User },
    { name: "Settings", href: "#settings", icon: Settings },
  ];

  return (
    <aside className="w-72 bg-[#08101D] text-slate-300 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen p-6 font-sans">
      {/* Top Section: Brand & Nav Items */}
      <div className="space-y-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-600/40 group-hover:scale-105 transition-transform duration-300">
            <ShieldAlert className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Rescue<span className="text-red-500">AI</span>
            </span>
            <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-slate-400">
              Citizen Portal
            </span>
          </div>
        </Link>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Emergency Helplines & Status Cards */}
      <div className="space-y-4 pt-6 border-t border-slate-800/80">
        {/* Bottom Card 1: Emergency Helpline Widget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider">
            <Phone className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Emergency Helplines</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
            <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">EOC:</span>
              <strong className="text-red-400 font-bold">112</strong>
            </div>
            <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Police:</span>
              <strong className="text-blue-400 font-bold">100</strong>
            </div>
            <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Fire:</span>
              <strong className="text-amber-400 font-bold">101</strong>
            </div>
            <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Medical:</span>
              <strong className="text-emerald-400 font-bold">102</strong>
            </div>
          </div>
        </div>

        {/* Bottom Card 2: Green Safety Status Card */}
        <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-emerald-400">You are Safe</h4>
            <p className="text-[10px] text-slate-400">No active local hazards reported.</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="w-full py-3 px-4 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Portal</span>
        </button>
      </div>
    </aside>
  );
};
