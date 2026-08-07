"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Wifi,
  WifiOff,
  LogOut,
  Activity,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const router = useRouter();

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                Rescue<span className="text-red-600">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-600 dark:bg-red-950/80 dark:text-red-400 border border-red-200 dark:border-red-900/50 uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold tracking-wide">
              DISASTER COORDINATION PLATFORM
            </p>
          </div>
        </Link>

        {/* Center Live Network & Sync Indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border transition-all ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60 animate-pulse"
            }`}
          >
            {isOnline ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>ONLINE - LIVE SYNC</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>OFFLINE - LOCAL STORAGE ACTIVE</span>
              </>
            )}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick SOS Trigger Button */}
          <Link
            href="/dashboard/sos"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black shadow-md shadow-red-600/30 flex items-center gap-2 tracking-wider uppercase transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>SOS DISPATCH</span>
          </Link>

          {/* User Profile & Role Indicator */}
          {userProfile ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-extrabold text-gray-900 dark:text-slate-100 truncate max-w-[100px]">
                    {userProfile.name}
                  </p>
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block leading-none">
                    {userProfile.role}
                  </span>
                </div>
              </button>

              {/* Profile Dropdown Drawer */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {userProfile.name}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate mt-0.5">
                      {userProfile.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
