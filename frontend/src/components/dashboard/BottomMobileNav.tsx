"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Flame, Bot, MapPin, FileText } from "lucide-react";
import { DashboardViewMode } from "./Sidebar";

interface BottomMobileNavProps {
  activeView?: DashboardViewMode;
  onSelectView?: (view: DashboardViewMode) => void;
}

export const BottomMobileNav: React.FC<BottomMobileNavProps> = ({ activeView = "dashboard", onSelectView }) => {
  const pathname = usePathname();

  const navItems: { label: string; viewKey: DashboardViewMode; href: string; icon: React.ElementType }[] = [
    { label: "Dashboard", viewKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "SOS Alert", viewKey: "sos", href: "/dashboard/sos", icon: Flame },
    { label: "AI Chat", viewKey: "ai-assistant", href: "/dashboard/ai-assistant", icon: Bot },
    { label: "Shelters", viewKey: "shelters", href: "/dashboard#shelters", icon: MapPin },
    { label: "Requests", viewKey: "my-requests", href: "/dashboard#my-requests", icon: FileText },
  ];

  const handleClick = (item: (typeof navItems)[0], e: React.MouseEvent) => {
    if (onSelectView) {
      if (item.viewKey === "sos" || item.viewKey === "ai-assistant") {
        return;
      }
      e.preventDefault();
      onSelectView(item.viewKey);
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl font-sans">
      {navItems.map((item) => {
        const IconComp = item.icon;
        const isSOS = item.viewKey === "sos";
        const isSelected = activeView === item.viewKey || pathname === item.href;

        if (isSOS) {
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleClick(item, e)}
              className="-mt-5 flex flex-col items-center group cursor-pointer"
            >
              <div className="w-13 h-13 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-600/50 border-2 border-slate-950 animate-pulse group-hover:scale-105 transition-transform">
                <IconComp className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-red-500 mt-0.5 tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => handleClick(item, e)}
            className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all ${
              isSelected ? "text-red-500 font-extrabold" : "text-slate-400 hover:text-slate-200 font-semibold"
            }`}
          >
            <IconComp className={`w-5 h-5 ${isSelected ? "text-red-500" : "text-slate-400"}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
