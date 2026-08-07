"use client";

import React from "react";
import { BookOpen, ExternalLink, ShieldCheck, Heart, CloudRain, CheckSquare } from "lucide-react";

export const EmergencyResources: React.FC = () => {
  const resources = [
    { title: "NDMA Safety Guidelines", desc: "National Disaster Management Authority", icon: ShieldCheck, url: "https://ndma.gov.in" },
    { title: "NDRF Response Information", desc: "National Disaster Response Force", icon: BookOpen, url: "https://ndrf.gov.in" },
    { title: "Health Ministry Directives", desc: "Emergency Medical Triage Protocols", icon: Heart, url: "https://mohfw.gov.in" },
    { title: "National Meteorological Department", desc: "Real-time Cyclone & Rainfall Alerts", icon: CloudRain, url: "https://mausam.imd.gov.in" },
    { title: "Family Preparedness Checklist", desc: "Download 72-Hour Survival Kit Guide", icon: CheckSquare, url: "#checklist" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900">Official Resources</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">VERIFIED SOURCES</span>
      </div>

      <div className="space-y-2.5">
        {resources.map((res) => {
          const IconComp = res.icon;
          return (
            <a
              key={res.title}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl transition-all block group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white text-slate-700 rounded-lg shadow-2xs group-hover:text-blue-600 transition-colors">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {res.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">{res.desc}</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
