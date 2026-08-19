"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { Plus, Minus, Compass, Radio } from "lucide-react";
=======
import { Plus, Minus, Compass, Radio, MapPin, Locate } from "lucide-react";
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
import { subscribeLiveSOSQueue } from "@/services/sosService";
import { SOSFirestoreRequest } from "@/types/auth";

export const MapCard: React.FC = () => {
  const [zoom, setZoom] = useState(14);
  const [activeLayer, setActiveLayer] = useState<"all" | "shelters" | "incidents">("all");
  const [liveIncidents, setLiveIncidents] = useState<SOSFirestoreRequest[]>([]);
<<<<<<< HEAD
=======
  const [deviceCoords, setDeviceCoords] = useState<{ lat: number; lng: number }>({
    lat: 12.9716, // Default Karnataka / Bangalore emergency hub fallback
    lng: 77.5946,
  });

  // Attempt to lock device's real-time GPS coordinates on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDeviceCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.warn("Device GPS notice:", err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)

  useEffect(() => {
    const unsubscribe = subscribeLiveSOSQueue((list) => {
      setLiveIncidents(list);
    });
    return () => unsubscribe();
  }, []);

  const latestInc = liveIncidents.length > 0 ? liveIncidents[0] : null;
<<<<<<< HEAD
  const lat = latestInc?.latitude || 37.7749;
  const lng = latestInc?.longitude || -122.4194;
=======
  const lat = latestInc?.latitude || deviceCoords.lat;
  const lng = latestInc?.longitude || deviceCoords.lng;

  const handleCenterGPS = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDeviceCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        null,
        { enableHighAccuracy: true }
      );
    }
  };
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-black text-slate-900">Live Geospatial Emergency Map</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Real-time GIS telemetry • 8 Shelters • {liveIncidents.length} Active SOS Signals in Firestore
          </p>
        </div>

<<<<<<< HEAD
        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveLayer("all")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeLayer === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All Nodes
          </button>
          <button
            onClick={() => setActiveLayer("shelters")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeLayer === "shelters" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Shelters
          </button>
          <button
            onClick={() => setActiveLayer("incidents")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeLayer === "incidents" ? "bg-white text-red-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Incidents ({liveIncidents.length})
          </button>
        </div>
      </div>

      {/* Map Graphics Canvas with Embedded Live Map */}
      <div className="relative h-80 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <iframe
          title="Citizen Emergency Map"
=======
        {/* Layer Filters & Recenter GPS */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCenterGPS}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            title="Lock map to current physical device GPS"
          >
            <Locate className="w-3.5 h-3.5 text-red-600" />
            <span>Center My GPS</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveLayer("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeLayer === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All Nodes
            </button>
            <button
              onClick={() => setActiveLayer("shelters")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeLayer === "shelters" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Shelters
            </button>
            <button
              onClick={() => setActiveLayer("incidents")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeLayer === "incidents" ? "bg-white text-red-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Incidents ({liveIncidents.length})
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Optimized GIS Canvas */}
      <div className="relative h-72 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center touch-manipulation">
        <iframe
          title="Citizen Emergency GIS Map"
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
<<<<<<< HEAD
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`}
          className="w-full h-full grayscale-[20%] contrast-[1.1] opacity-90"
        />

        {/* Floating Telemetry Info Overlay */}
        <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-xl max-w-xs text-xs text-white">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-black">Firestore Telemetry Stream</span>
          </div>
          {latestInc ? (
            <p className="text-[11px] text-slate-300 font-mono">
              Active SOS by <strong className="text-red-400">{latestInc.citizenName}</strong> ({latestInc.latitude.toFixed(4)}°, {latestInc.longitude.toFixed(4)}°)
            </p>
          ) : (
            <p className="text-[11px] text-slate-400">GPS Locked. Ready to broadcast SOS signal.</p>
          )}
        </div>

        {/* Map Floating Zoom Controls */}
        <div className="absolute top-4 left-4 z-30 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 flex flex-col gap-2 shadow-xl">
          <button
            onClick={() => setZoom(Math.min(zoom + 1, 18))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 1, 10))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-4 right-4 z-30 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400 animate-spin" />
          <span>ZOOM: {zoom}X • FIRESTORE REALTIME GPS</span>
=======
          src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`}
          className="w-full h-full grayscale-[15%] contrast-[1.1] opacity-95 pointer-events-auto"
        />

        {/* Clean Responsive Top Controls Bar */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
          {/* Zoom Buttons */}
          <div className="bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-2xl pointer-events-auto">
            <button
              onClick={() => setZoom(Math.min(zoom + 1, 19))}
              className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 1, 8))}
              className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Telemetry Overlay */}
          <div className="bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-800 shadow-2xl text-xs text-white max-w-[200px] sm:max-w-xs truncate pointer-events-auto">
            <div className="flex items-center gap-1.5 truncate">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
              <span className="font-bold truncate text-[11px]">
                {latestInc ? `SOS: ${latestInc.citizenName}` : "GPS Telemetry Lock"}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-mono truncate mt-0.5">
              {lat.toFixed(4)}°, {lng.toFixed(4)}°
            </p>
          </div>
        </div>

        {/* Bottom Status Pill */}
        <div className="absolute bottom-3 right-3 z-30 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-2 pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>ZOOM: {zoom}X • {lat.toFixed(4)}°, {lng.toFixed(4)}°</span>
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
        </div>
      </div>
    </motion.div>
  );
};
<<<<<<< HEAD
=======

>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
