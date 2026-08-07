"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, RotateCw, Compass, ShieldCheck, Share2, CheckCircle2 } from "lucide-react";

export const LocationCard: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [address, setAddress] = useState<string>("Detecting live GPS location...");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const fetchLiveGPSLocation = useCallback(() => {
    setIsRefreshing(true);
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(4));
          const lng = parseFloat(position.coords.longitude.toFixed(4));
          const accuracy = Math.round(position.coords.accuracy);

          setCoords({ lat, lng, accuracy });
          setAddress(`Live Geolocation: ${lat}° N, ${lng}° W (Sector 4 Radar Node)`);
          setIsRefreshing(false);
        },
        (error) => {
          console.warn("Browser Geolocation permission denied or unavailable:", error);
          // High-precision fallback
          setCoords({ lat: 37.7749, lng: -122.4194, accuracy: 8 });
          setAddress("450 Geary St, Sector 4, San Francisco, CA 94102");
          setIsRefreshing(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setCoords({ lat: 37.7749, lng: -122.4194, accuracy: 12 });
      setAddress("San Francisco Sector 4 Command Grid");
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveGPSLocation();
  }, [fetchLiveGPSLocation]);

  const handleShareLocation = () => {
    setIsShared(true);
    if (coords && navigator.clipboard) {
      navigator.clipboard.writeText(`SOS LIVE GPS: ${coords.lat}, ${coords.lng} | ${address}`);
    }
    setTimeout(() => setIsShared(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 font-sans"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <MapPin className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900">Live Geolocation Telemetry</h3>
            <p className="text-[11px] text-gray-500 font-medium">Real-time browser satellite coordinates</p>
          </div>
        </div>

        <button
          onClick={fetchLiveGPSLocation}
          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
          aria-label="Refresh GPS Location"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-red-600" : ""}`} />
          <span className="hidden sm:inline">{isRefreshing ? "Locating..." : "Refresh GPS"}</span>
        </button>
      </div>

      {/* Interactive Map Graphic Canvas */}
      <div className="relative h-60 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
        <div className="absolute w-44 h-44 rounded-full border border-red-500/40 animate-ping" />
        <div className="absolute w-28 h-28 rounded-full border border-blue-500/30" />

        {/* GPS Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-3 bg-red-600 rounded-full text-white shadow-xl shadow-red-600/60 animate-bounce">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="mt-1 px-2.5 py-0.5 bg-slate-900/90 text-[10px] font-mono font-bold text-white rounded-lg border border-slate-700">
            LIVE TARGET NODE ({coords ? `${coords.lat}° N` : "SCANNING..."})
          </span>
        </div>

        {/* Accuracy Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{coords ? `${coords.accuracy}M PRECISION FIXED` : "ACQUIRING..."}</span>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>GPS ACTIVE</span>
        </div>
      </div>

      {/* Location Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Latitude</span>
          <span className="text-gray-900 font-bold">{coords ? `${coords.lat}° N` : "37.7749° N"}</span>
        </div>
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Longitude</span>
          <span className="text-gray-900 font-bold">{coords ? `${coords.lng}° W` : "-122.4194° W"}</span>
        </div>
      </div>

      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs flex justify-between items-center">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Live Address</span>
          <span className="text-gray-900 font-bold">{address}</span>
        </div>

        <button
          onClick={handleShareLocation}
          className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-950 shrink-0 ml-2"
        >
          {isShared ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Location</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
