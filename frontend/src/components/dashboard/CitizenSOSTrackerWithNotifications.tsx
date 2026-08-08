"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { subscribeLiveSOSQueue } from "@/services/sosService";
import { SOSFirestoreRequest, SOSStatus } from "@/types/auth";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Navigation, AlertCircle, CheckCircle2, Clock, MapPin, Bell } from "lucide-react";

export const CitizenSOSTrackerWithNotifications: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeSOS, setActiveSOS] = useState<SOSFirestoreRequest | null>(null);
  const [notificationGranted, setNotificationGranted] = useState<boolean>(false);
  const previousStatusRef = useRef<SOSStatus | null>(null);

  // Request Push Notification Permissions
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationGranted(true);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            setNotificationGranted(true);
          }
        });
      }
    }
  }, []);

  // Listen to Citizen's active SOS requests in real time via Firestore onSnapshot
  useEffect(() => {
    if (!userProfile) return;

    const unsubscribe = subscribeLiveSOSQueue((allRequests) => {
      // Find the citizen's most recent active SOS request
      const citizenRequest = allRequests.find(
        (req) => req.uid === userProfile.uid || req.citizenName === userProfile.name
      );

      if (citizenRequest) {
        setActiveSOS(citizenRequest);

        // Check if status changed & trigger push notification!
        if (previousStatusRef.current && previousStatusRef.current !== citizenRequest.status) {
          triggerPushNotification(citizenRequest.status, citizenRequest.assignedTeamName);
        }
        previousStatusRef.current = citizenRequest.status;
      } else {
        setActiveSOS(null);
      }
    });

    return () => unsubscribe();
  }, [userProfile]);

  const triggerPushNotification = (status: SOSStatus, teamName?: string) => {
    const title = `🚨 RescueAI Alert: SOS Request Updated!`;
    const message = `Status changed to: [${status.toUpperCase()}]. ${
      teamName ? `${teamName} is responding to your location.` : "NDRF Rescue Command has updated your request."
    }`;

    // 1. Browser & Device Native Push Notification
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body: message,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
        });
      } catch (e) {
        console.warn("Native Notification error:", e);
      }
    }

    // 2. Audio Alert Tone
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const getStatusColor = (status: SOSStatus) => {
    switch (status) {
      case "Accepted":
      case "ACCEPTED":
      case "In Progress":
      case "IN_PROGRESS":
        return "bg-blue-600 text-white border-blue-400";
      case "Team On The Way":
      case "Reached":
        return "bg-purple-600 text-white border-purple-400";
      case "Resolved":
      case "Completed":
      case "COMPLETED":
        return "bg-emerald-600 text-white border-emerald-400";
      case "Pending":
      case "PENDING":
      default:
        return "bg-red-600 text-white border-red-400 animate-pulse";
    }
  };

  if (!activeSOS) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white mb-6 overflow-hidden relative"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600/20 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-500">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Live SOS Incident Tracking</h3>
            <p className="text-[11px] text-slate-400 font-medium">Real-time Push Notifications &amp; NDRF Dispatch</p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${getStatusColor(activeSOS.status)}`}>
          {activeSOS.status}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80 mb-4 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
          <span className="text-white font-black">{activeSOS.category}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Priority Triage</span>
          <span className="text-red-400 font-black">{activeSOS.priority}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Unit</span>
          <span className="text-cyan-400 font-bold">{activeSOS.assignedTeamName || "NDRF Central Squad"}</span>
        </div>
      </div>

      {/* Incident Progress Steps */}
      <div className="flex items-center justify-between pt-2 px-2 text-[10px] font-bold">
        <div className={`flex flex-col items-center gap-1 ${activeSOS.status ? "text-emerald-400" : "text-slate-600"}`}>
          <Clock className="w-4 h-4" />
          <span>Reported</span>
        </div>
        <div className="h-0.5 flex-1 bg-slate-800 mx-2" />
        <div className={`flex flex-col items-center gap-1 ${["Accepted", "ACCEPTED", "In Progress", "Team On The Way", "Reached", "Resolved"].includes(activeSOS.status) ? "text-emerald-400" : "text-slate-600"}`}>
          <Navigation className="w-4 h-4" />
          <span>Dispatched</span>
        </div>
        <div className="h-0.5 flex-1 bg-slate-800 mx-2" />
        <div className={`flex flex-col items-center gap-1 ${["Reached", "Resolved"].includes(activeSOS.status) ? "text-emerald-400" : "text-slate-600"}`}>
          <MapPin className="w-4 h-4" />
          <span>Reached</span>
        </div>
        <div className="h-0.5 flex-1 bg-slate-800 mx-2" />
        <div className={`flex flex-col items-center gap-1 ${["Resolved", "Completed", "COMPLETED"].includes(activeSOS.status) ? "text-emerald-400" : "text-slate-600"}`}>
          <ShieldCheck className="w-4 h-4" />
          <span>Rescued</span>
        </div>
      </div>
    </motion.div>
  );
};
