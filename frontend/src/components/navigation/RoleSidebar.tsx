"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";

interface MenuItem {
  title: string;
  href: string;
  icon: string;
}

const MENU_ITEMS: Record<UserRole, MenuItem[]> = {
  Citizen: [
    { title: "Citizen Overview", href: "/dashboard", icon: "🏠" },
    { title: "Safety & Evacuation", href: "/dashboard#evacuation", icon: "🗺️" },
    { title: "Status Updates", href: "/dashboard#updates", icon: "📢" },
    { title: "My Profile", href: "/dashboard#profile", icon: "👤" },
  ],
  "Rescue Team": [
    { title: "Rescue Operational Board", href: "/rescue-dashboard", icon: "🚨" },
    { title: "Dispatch & Location Map", href: "/rescue-dashboard#dispatch", icon: "📍" },
    { title: "Resource Requests", href: "/rescue-dashboard#resources", icon: "📦" },
    { title: "Team Field Logs", href: "/rescue-dashboard#logs", icon: "📋" },
  ],
  Administrator: [
    { title: "System Administration", href: "/admin", icon: "⚙️" },
    { title: "User & Role Management", href: "/admin#users", icon: "👥" },
    { title: "System Analytics & Logs", href: "/admin#analytics", icon: "📊" },
    { title: "Broadcast Crisis Alert", href: "/admin#alert", icon: "⚠️" },
  ],
};

const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  Citizen: "bg-emerald-950 text-emerald-300 border-emerald-800",
  "Rescue Team": "bg-amber-950 text-amber-300 border-amber-800",
  Administrator: "bg-red-950 text-red-300 border-red-800",
};

export const RoleSidebar: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const role: UserRole = userProfile?.role || "Citizen";
  const menuList = MENU_ITEMS[role] || MENU_ITEMS["Citizen"];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col justify-between p-4 text-slate-100">
      <div>
        {/* RescueAI Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-red-900/40">
            🆘
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none text-slate-100">RescueAI</h2>
            <span className="text-xs text-red-400 font-medium">Emergency Ops</span>
          </div>
        </div>

        {/* User Card */}
        {userProfile && (
          <div className="mb-6 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-200">
                {userProfile.photoURL ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  userProfile.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-slate-200">{userProfile.name}</p>
                <p className="text-xs text-slate-400 truncate">{userProfile.email}</p>
              </div>
            </div>

            {/* Role Badge */}
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${ROLE_BADGE_STYLES[role]}`}
            >
              {role}
            </span>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            {role} Portal
          </p>
          {menuList.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-600 text-white shadow-md shadow-red-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
