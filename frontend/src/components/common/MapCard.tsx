"use client";

import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { GeoLocation } from "@/types";

interface MapCardProps {
  location?: GeoLocation;
  title?: string;
  height?: string;
  zoom?: number;
  className?: string;
}

export const MapCard: React.FC<MapCardProps> = ({
  location,
  title = "Live GPS Incident Location",
  height = "h-80",
  className = "",
}) => {
  const lat = location?.latitude || 37.7749;
  const lng = location?.longitude || -122.4194;

  return (
    <div
      className={`relative w-full ${height} rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-slate-900 shadow-md group ${className}`}
    >
      {/* Background Interactive / Static Map Frame Placeholder */}
      <iframe
        title="Google Maps Location Tracker"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={`https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
        className="w-full h-full grayscale-[20%] contrast-[1.1] opacity-90 group-hover:opacity-100 transition-opacity"
      />

      {/* Map Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-100 dark:border-slate-800 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-600 text-white rounded-lg animate-pulse">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 dark:text-white">{title}</h4>
            <p className="text-[10px] font-mono font-medium text-gray-500 dark:text-slate-400">
              LAT: {lat.toFixed(4)} | LNG: {lng.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      {/* Recenter Button */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/40 flex items-center gap-2 transition-all"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get GPS Navigation</span>
        </a>
      </div>
    </div>
  );
};
