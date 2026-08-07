"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Volume2, VolumeX, AlertTriangle, Radio } from "lucide-react";
import { subscribeEmergencyBroadcasts, EmergencyBroadcastMessage } from "@/services/authService";

export const AlertCard: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [liveBroadcasts, setLiveBroadcasts] = useState<EmergencyBroadcastMessage[]>([]);

  // Default fallback broadcast alerts
  const defaultAlerts: EmergencyBroadcastMessage[] = [
    {
      id: "ALT-901",
      title: "Flash Flood & High Surge Warning",
      category: "FLOOD",
      severity: "CRITICAL",
      affectedZone: "Coastal Sector 4 & Lowland Basins",
      radius: "5.2 Miles Radius",
      instruction: "Move immediately to higher ground. Evacuation Shelters #1 & #3 are actively taking in residents.",
      dispatchedByEmail: "eoc@rescueai.gov.in",
      dispatchedByName: "National Disaster Command",
      timestamp: new Date().toISOString(),
    },
    {
      id: "ALT-884",
      title: "Severe Heatwave & Grid Stress Advisory",
      category: "HEATWAVE",
      severity: "WARNING",
      affectedZone: "Inland Metropolitan Grid",
      radius: "12 Miles Radius",
      instruction: "Stay hydrated. Community Cooling Nodes are open at City Center Arena.",
      dispatchedByEmail: "met@rescueai.gov.in",
      dispatchedByName: "Meteorological Bureau",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  // Subscribe to real-time Super Admin Broadcasts stream
  useEffect(() => {
    const unsub = subscribeEmergencyBroadcasts((messages) => {
      if (messages && messages.length > 0) {
        setLiveBroadcasts(messages);
      }
    });

    return () => unsub();
  }, []);

  const displayAlerts = liveBroadcasts.length > 0 ? liveBroadcasts : defaultAlerts;

  const filteredAlerts = displayAlerts.filter(
    (alt) => filterSeverity === "ALL" || alt.severity === filterSeverity
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>National Disaster Warning Broadcasts</span>
              <Radio className="w-3.5 h-3.5 text-red-600 animate-ping" />
            </h3>
            <p className="text-xs text-slate-500 font-medium">Real-Time Emergency Alerts &amp; Evacuation Directives</p>
          </div>
        </div>

        {/* Audio Broadcast Toggle */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            audioEnabled
              ? "bg-red-600 text-white shadow-md shadow-red-950"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{audioEnabled ? "Audio Broadcast Active" : "Mute Audio Alerts"}</span>
        </button>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "CRITICAL", "WARNING", "ADVISORY"].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
              filterSeverity === sev
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alt) => {
          const badgeClass =
            alt.severity === "CRITICAL"
              ? "bg-red-100 text-red-700 border-red-200"
              : alt.severity === "WARNING"
              ? "bg-amber-100 text-amber-700 border-amber-200"
              : "bg-blue-100 text-blue-700 border-blue-200";

          return (
            <div
              key={alt.id}
              className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <h4 className="text-xs font-black text-slate-900">{alt.title}</h4>
                </div>
                <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${badgeClass}`}>
                  {alt.severity}
                </span>
              </div>

              <p className="text-xs text-slate-700 font-medium">{alt.instruction}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                <span>
                  Zone: <strong className="text-slate-900 font-bold">{alt.affectedZone}</strong> ({alt.radius})
                </span>
                <span>{new Date(alt.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
