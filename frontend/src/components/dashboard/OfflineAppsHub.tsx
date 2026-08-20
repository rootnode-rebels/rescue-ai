"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  MapPin,
  Radio,
  Download,
  WifiOff,
  Bluetooth,
  HeartPulse,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2,
} from "lucide-react";

export interface EssentialOfflineApp {
  id: string;
  name: string;
  category: "MAPS" | "COMMUNICATION" | "FIRST_AID" | "RADIO";
  description: string;
  offlineTechnology: string;
  playStoreUrl: string;
  appStoreUrl: string;
  apkDownloadUrl?: string;
  badge: string;
  badgeColor: string;
}

export const OfflineAppsHub: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const offlineApps: EssentialOfflineApp[] = [
    {
      id: "app-osmand",
      name: "OsmAnd Offline Maps & GPS",
      category: "MAPS",
      description:
        "Comprehensive offline vector maps, satellite terrain data, and turn-by-turn GPS navigation. Requires zero mobile data or cellular network connection.",
      offlineTechnology: "Offline Vector Maps & Local Storage Mesh",
      playStoreUrl: "https://play.google.com/store/apps/details?id=net.osmand",
      appStoreUrl: "https://apps.apple.com/app/osmand-maps-travel-navigate/id1058342392",
      apkDownloadUrl: "https://osmand.net/docs/versions/free-versions/",
      badge: "100% Offline Maps",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    {
      id: "app-organicmaps",
      name: "Organic Maps: Offline Hike & Drive",
      category: "MAPS",
      description:
        "Fast, detailed, 100% offline maps based on OpenStreetMap. Engineered for disaster zones with zero tracking and ultra-low battery consumption.",
      offlineTechnology: "Offline OpenStreetMap Vector Engine",
      playStoreUrl: "https://play.google.com/store/apps/details?id=app.organicmaps",
      appStoreUrl: "https://apps.apple.com/app/organic-maps-offline-hike-bike/id1515227262",
      badge: "Zero Data Required",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: "app-bridgeify",
      name: "Bridgeify — Offline Mesh Chat",
      category: "COMMUNICATION",
      description:
        "Sends encrypted peer-to-peer messages via Bluetooth antenna mesh up to 330 feet (100m) hop-by-hop without internet or cellular network connection.",
      offlineTechnology: "Bluetooth Low Energy (BLE) Mesh Network",
      playStoreUrl: "https://play.google.com/store/apps/details?id=me.bridgeify.main",
      appStoreUrl: "https://apps.apple.com/app/bridgeify/id975772341",
      badge: "Bluetooth Mesh",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      id: "app-serval",
      name: "Bluetooth & Wi-Fi Direct Walkie Talkie",
      category: "COMMUNICATION",
      description:
        "Turns your smartphone into a two-way offline push-to-talk (PTT) radio walkie-talkie using Wi-Fi Direct and Bluetooth audio channels.",
      offlineTechnology: "Wi-Fi Direct P2P & Bluetooth Audio Channel",
      playStoreUrl: "https://play.google.com/store/apps/details?id=com.remal.walkietalkie",
      appStoreUrl: "https://apps.apple.com/app/walkie-talkie-communication/id1456387222",
      badge: "Offline Calling / PTT",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      id: "app-redcross",
      name: "First Aid by American Red Cross",
      category: "FIRST_AID",
      description:
        "Pre-loaded medical triage protocols, CPR step-by-step videos, and disaster emergency survival checklists accessible without cellular coverage.",
      offlineTechnology: "Pre-Downloaded Medical Video & Text Assets",
      playStoreUrl: "https://play.google.com/store/apps/details?id=com.cube.arc.fa",
      appStoreUrl: "https://apps.apple.com/app/first-aid-by-american-red-cross/id529160691",
      badge: "Pre-Loaded Medical Triage",
      badgeColor: "bg-red-100 text-red-800 border-red-200",
    },
    {
      id: "app-fmradio",
      name: "NextRadio Offline FM Broadcast",
      category: "RADIO",
      description:
        "Unlocks your smartphone's built-in offline FM radio chip to tune into official government disaster broadcast frequencies without using mobile data.",
      offlineTechnology: "Hardware FM Receiver Chip Antenna",
      playStoreUrl: "https://play.google.com/store/apps/details?id=com.nextradioapp.nextradio",
      appStoreUrl: "https://apps.apple.com/app/fm-radio-offline/id129849204",
      badge: "Hardware FM Tuning",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
  ];

  const filteredApps = offlineApps.filter((app) => {
    const matchesCat = filterCategory === "ALL" || app.category === filterCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.offlineTechnology.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/30">
            <WifiOff className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Essential Offline Disaster Apps &amp; Mesh Calling Hub</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Curated Offline Maps, Bluetooth Walkie-Talkie Apps, and Pre-Loaded First Aid Tools for Disaster Zones
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offline apps (mesh, maps)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 font-medium"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "ALL", label: "All Offline Tools" },
          { id: "MAPS", label: "Offline Maps & Navigation" },
          { id: "COMMUNICATION", label: "Bluetooth Mesh & Walkie-Talkie" },
          { id: "FIRST_AID", label: "Medical & Survival Guides" },
          { id: "RADIO", label: "FM Radio & Siren" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-4 hover:bg-white hover:shadow-lg transition-all duration-200 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {app.category === "MAPS" && (
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl border border-blue-200">
                      <MapPin className="w-5 h-5" />
                    </div>
                  )}
                  {app.category === "COMMUNICATION" && (
                    <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl border border-purple-200">
                      <Bluetooth className="w-5 h-5" />
                    </div>
                  )}
                  {app.category === "FIRST_AID" && (
                    <div className="p-2.5 bg-red-100 text-red-700 rounded-xl border border-red-200">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                  )}
                  {app.category === "RADIO" && (
                    <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl border border-amber-200">
                      <Radio className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
                      {app.name}
                    </h4>
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${app.badgeColor}`}>
                      {app.badge}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {app.description}
              </p>

              <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] font-mono text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Offline Technology Engine:</span>
                <span className="text-slate-600">{app.offlineTechnology}</span>
              </div>
            </div>

            {/* Direct Store Download Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
              <a
                href={app.playStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Google Play</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={app.appStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Apple App Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {app.apkDownloadUrl && (
                <a
                  href={app.apkDownloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3 text-emerald-600" />
                  <span>APK File</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
