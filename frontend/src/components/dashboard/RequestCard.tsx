"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Clock, MapPin, Radio, ShieldCheck, Ambulance } from "lucide-react";
import { subscribeLiveSOSQueue } from "@/services/sosService";
import { SOSFirestoreRequest } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

export const RequestCard: React.FC = () => {
  const { userProfile } = useAuth();
  const [requests, setRequests] = useState<SOSFirestoreRequest[]>([]);

  useEffect(() => {
    const unsub = subscribeLiveSOSQueue((liveList) => {
      // Show requests for current user or recent live emergency requests
      if (userProfile?.uid) {
        const userSpecific = liveList.filter(
          (r) => r.uid === userProfile.uid || r.citizenName === userProfile.name
        );
        if (userSpecific.length > 0) {
          setRequests(userSpecific);
          return;
        }
      }
      setRequests(liveList.slice(0, 5));
    });

    return () => unsub();
  }, [userProfile]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "In Progress":
        return "bg-amber-100 text-amber-800 border-amber-300 animate-pulse";
      case "Resolved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span>Live Emergency Requests Stream</span>
          <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-bold text-xs rounded-full flex items-center gap-1">
            <Radio className="w-3 h-3 text-red-600 animate-ping" />
            <span>{requests.length} Active</span>
          </span>
        </h3>
        <span className="text-xs font-bold text-slate-400 font-mono">
          Real-Time Sync ⚡
        </span>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-semibold">
            No active SOS emergency requests in stream.
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.requestId}
              className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                    <Flame className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-black text-slate-900">{req.requestId}</span>
                  <span className="text-xs text-slate-500 font-medium">• {req.category}</span>
                </div>
                <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${getStatusBadge(req.status)}`}>
                  {req.status.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-slate-700 font-medium line-clamp-1">{req.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Ambulance className="w-3.5 h-3.5 text-slate-500" />
                  <span>Team: <strong className="text-slate-900 font-bold">{req.assignedTeamName || "Dispatching..."}</strong></span>
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{req.latitude.toFixed(2)}, {req.longitude.toFixed(2)}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
