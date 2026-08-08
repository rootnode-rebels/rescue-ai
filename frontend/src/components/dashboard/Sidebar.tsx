"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  Flame,
  Bot,
  Building,
  FileText,
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  Radio,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export type DashboardViewMode =
  | "dashboard"
  | "sos"
  | "ai-assistant"
  | "shelters"
  | "my-requests"
  | "guide"
  | "alerts"
  | "profile"
  | "settings"
  | "rescue-dashboard";

interface SidebarProps {
  activeView?: DashboardViewMode;
  onSelectView?: (view: DashboardViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView = "dashboard", onSelectView }) => {
  const pathname = usePathname();
  const { userProfile, logout } = useAuth();

  const isRescueUser = userProfile?.role === "rescue_admin" || userProfile?.role === "rescue";
  const isAdminUser = userProfile?.role === "global_admin";

  // Strict Role-Based Menu Filtering
  const getRoleBasedItems = () => {
    if (isRescueUser) {
      return [
        {
          id: "rescue-dashboard",
          label: "Tactical Command Grid",
          icon: Radio,
          href: "/rescue-dashboard",
          badge: "OPERATIONAL",
        },
        {
          id: "my-requests",
          label: "Active Dispatches",
          icon: FileText,
          href: "/rescue-dashboard#dispatches",
        },
        {
          id: "profile",
          label: "Rescue Unit Profile",
          icon: User,
          href: "/rescue-dashboard#profile",
        },
        {
          id: "settings",
          label: "Console Settings",
          icon: Settings,
          href: "/rescue-dashboard#settings",
        },
      ];
    }

    if (isAdminUser) {
      return [
        {
          id: "admin",
          label: "EOC Super Admin",
          icon: Shield,
          href: "/admin",
          badge: "SUPER ADMIN",
        },
        {
          id: "alerts",
          label: "National Alerts",
          icon: Bell,
          href: "/admin#alerts",
        },
        {
          id: "rescue-dashboard",
          label: "NDRF Operations",
          icon: Radio,
          href: "/rescue-dashboard",
        },
        {
          id: "profile",
          label: "Admin Profile",
          icon: User,
          href: "/admin#profile",
        },
      ];
    }

    // Default: Citizen Role
    return [
      {
        id: "dashboard",
        label: "Citizen Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        id: "sos",
        label: "Emergency SOS",
        icon: Flame,
        href: "/sos",
        badge: "LIVE",
      },
      {
        id: "ai-assistant",
        label: "AI Survival Assistant",
        icon: Bot,
        href: "/ai-assistant",
      },
      {
        id: "my-requests",
        label: "My SOS History",
        icon: FileText,
        href: "/dashboard#my-requests",
      },
      {
        id: "shelters",
        label: "Relief Shelters",
        icon: Building,
        href: "/dashboard#shelters",
      },
      {
        id: "alerts",
        label: "Live Emergency Alerts",
        icon: Bell,
        href: "/dashboard#alerts",
      },
      {
        id: "guide",
        label: "Emergency Guide",
        icon: BookOpen,
        href: "/dashboard#guide",
      },
      {
        id: "profile",
        label: "My Profile",
        icon: User,
        href: "/dashboard#profile",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        href: "/dashboard#settings",
      },
    ];
  };

  const navigationItems = getRoleBasedItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 z-30 font-sans">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-xl text-white flex items-center justify-center font-bold shadow-lg shadow-red-900/50 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-black text-white text-base tracking-tight leading-none">
            Rescue<span className="text-red-500">AI</span>
          </h1>
          <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
            {isAdminUser
              ? "Super Admin EOC"
              : isRescueUser
              ? "NDRF Command"
              : "Citizen Portal"}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 no-scrollbar">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (activeView && activeView === item.id);

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => onSelectView && onSelectView(item.id as DashboardViewMode)}
              className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-200 group ${
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[9px] font-black bg-red-500/20 text-red-400 border border-red-500/30 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {userProfile?.name?.charAt(0) || "U"}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{userProfile?.name || "Citizen"}</p>
            <p className="text-[10px] text-slate-400 truncate font-mono uppercase">{userProfile?.role || "citizen"}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
