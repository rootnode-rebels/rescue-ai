"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, Navigation, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { GeoLocation } from "@/types";

interface LiveGPSMapProps {
  onLocationCaptured?: (location: GeoLocation) => void;
  height?: string;
  className?: string;
}

export const LiveGPSMap: React.FC<LiveGPSMapProps> = ({
  onLocationCaptured,
  height = "h-80",
  className = "",
}) => {
  const [location, setLocation] = useState<GeoLocation>({
    latitude: 37.7749,
    longitude: -122.4194,
    address: "Market St & 10th St, San Francisco, CA",
    accuracy: 8,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveGPS = useCallback(() => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: GeoLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
            address: `GPS Fixed (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
          };
          setLocation(loc);
          if (onLocationCaptured) onLocationCaptured(loc);
          setLoading(false);
        },
        (err) => {
          console.warn("Geolocation warning:", err.message);
          setError("Using default fallback GPS coordinates. Enable location permissions for precise tracking.");
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation API is not supported by your browser.");
      setLoading(false);
    }
  }, [onLocationCaptured]);

  useEffect(() => {
    fetchLiveGPS();
  }, [fetchLiveGPS]);

  return (
    <div className={`relative w-full ${height} rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-slate-950 shadow-lg group ${className}`}>
      {/* Google Maps iFrame */}
      <iframe
        title="Live Satellite GPS Tracker"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${location.latitude},${location.longitude}&zoom=15`
            : `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`
        }
        className="w-full h-full grayscale-[25%] contrast-[1.1] opacity-90 group-hover:opacity-100 transition-opacity"
      />

      {/* Top Left GPS Status Card */}
      <div className="absolute top-4 left-4 z-10 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-100 dark:border-slate-800 shadow-xl max-w-xs">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-1.5 bg-red-600 text-white rounded-xl shadow-md shadow-red-600/30 animate-pulse">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Live GPS Lock
            </h4>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Accurate ±{location.accuracy?.toFixed(0) || 10}m
            </span>
          </div>
        </div>

        <p className="text-[11px] font-mono text-gray-600 dark:text-slate-300 font-medium truncate mt-1">
          LAT: {location.latitude.toFixed(4)} | LNG: {location.longitude.toFixed(4)}
        </p>

        {error && (
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span className="truncate">{error}</span>
          </p>
        )}
      </div>

      {/* Top Right Re-Lock GPS Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={fetchLiveGPS}
          disabled={loading}
          className="p-3 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-md transition-all flex items-center justify-center disabled:opacity-50"
          title="Recalibrate GPS Location"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-500" : ""}`} />
        </button>
      </div>

      {/* Bottom Right Direct Navigation Link */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xl shadow-red-600/40 flex items-center gap-2 transition-all uppercase tracking-wider"
        >
          <Navigation className="w-4 h-4" />
          <span>Open Google Maps</span>
        </a>
      </div>
    </div>
  );
};
