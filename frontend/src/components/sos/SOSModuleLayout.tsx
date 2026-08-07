"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { TopNavbar } from "../dashboard/TopNavbar";
import { SOSBanner } from "./SOSBanner";
import { QuickActionCard } from "./QuickActionCard";
import { EmergencyForm } from "./EmergencyForm";
import { LocationCard } from "./LocationCard";
import { EmergencyButton } from "./EmergencyButton";
import { AIAnalysisCard } from "./AIAnalysisCard";
import { SafetyGuidanceCard } from "./SafetyGuidanceCard";
import { SecurityInfoCard } from "./SecurityInfoCard";
import { saveOfflineSOS, getPendingOfflineSOS } from "@/lib/dexie-db";
import {
  createSOSRequestInFirestore,
  updateSOSLocationInFirestore,
  subscribeUserActiveSOS,
} from "@/services/sosService";
import { SOSFirestoreRequest, SOSStatus } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, ShieldAlert, Sparkles, X, MapPin, Radio, Clock } from "lucide-react";

export const SOSModuleLayout: React.FC = () => {
  const { userProfile } = useAuth();
  const [description, setDescription] = useState("");
  const [emergencyType, setEmergencyType] = useState("Flood");
  const [peopleAffected, setPeopleAffected] = useState(1);
  const [activeSOS, setActiveSOS] = useState<SOSFirestoreRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number; address: string }>({
    lat: 37.7749,
    lng: -122.4194,
    address: "High-Precision GPS Sector 4",
  });

  const watchIdRef = useRef<number | null>(null);

  // Background Sync when network returns
  useEffect(() => {
    const syncOfflineItems = async () => {
      if (navigator.onLine) {
        const pending = await getPendingOfflineSOS();
        for (const item of pending) {
          await createSOSRequestInFirestore({
            requestId: item.id,
            citizenName: item.userName,
            userPhone: item.userPhone,
            category: item.category,
            description: item.description,
            peopleCount: item.peopleCount,
            latitude: item.location.latitude,
            longitude: item.location.longitude,
            status: "Pending",
          });
        }
      }
    };

    window.addEventListener("online", syncOfflineItems);
    return () => window.removeEventListener("online", syncOfflineItems);
  }, []);

  // Capture initial position
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: `GPS Locked: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° W`,
          });
        },
        (err) => {
          console.warn("GPS Location fallback:", err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Real-time Firestore subscriber for active SOS status changes
  useEffect(() => {
    if (activeSOS?.requestId) {
      const unsubscribe = subscribeUserActiveSOS(activeSOS.requestId, (updatedData) => {
        if (updatedData) {
          setActiveSOS(updatedData);
        }
      });
      return () => unsubscribe();
    }
  }, [activeSOS?.requestId]);

  const handleSendAlert = async () => {
    try {
      const reqId = "sos-" + Date.now();
      const newRecord: SOSFirestoreRequest = {
        requestId: reqId,
        uid: userProfile?.uid || "citizen-101",
        citizenName: userProfile?.name || "David Miller",
        userPhone: userProfile?.phone || "+1 (555) 234-5678",
        category: emergencyType.toUpperCase(),
        description: description || `Emergency ${emergencyType} alert filed.`,
        priority: "CRITICAL",
        status: "Pending",
        latitude: coords.lat,
        longitude: coords.lng,
        address: coords.address,
        peopleCount: peopleAffected,
        medicalNeeds: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOfflineCreated: !navigator.onLine,
      };

      // 1. Instant local Dexie IndexedDB save for 100% offline resilience
      await saveOfflineSOS({
        id: reqId,
        userId: newRecord.uid,
        userName: newRecord.citizenName,
        userPhone: newRecord.userPhone,
        category: newRecord.category as import("@/types").SOSCategory,
        description: newRecord.description,
        location: {
          latitude: coords.lat,
          longitude: coords.lng,
          address: coords.address,
        },
        priority: "CRITICAL",
        status: "PENDING",
        peopleCount: peopleAffected,
        medicalNeeds: true,
        createdAt: newRecord.createdAt,
        updatedAt: newRecord.updatedAt,
      });

      // 2. Write to Firestore immediately (onSnapshot subscribers update instantly!)
      await createSOSRequestInFirestore(newRecord);
      setActiveSOS(newRecord);
      setShowModal(true);

      // 3. Initiate watchPosition for streaming live GPS coordinates into Firestore doc
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const newLat = pos.coords.latitude;
            const newLng = pos.coords.longitude;
            setCoords({
              lat: newLat,
              lng: newLng,
              address: `GPS Live Track: ${newLat.toFixed(4)}° N, ${newLng.toFixed(4)}° W`,
            });
            updateSOSLocationInFirestore(reqId, newLat, newLng);
          },
          (err) => console.warn("watchPosition error:", err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 }
        );
      }
    } catch (error) {
      console.error("Error creating SOS signal:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
      {/* Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <TopNavbar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Top Banner */}
          <SOSBanner />

          {/* Quick Helpline Cards */}
          <QuickActionCard />

          {/* Active Real-Time Status Progress Bar */}
          {activeSOS && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-white space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  <h3 className="text-base font-black uppercase tracking-wider">
                    Live SOS Status Progress Tracker
                  </h3>
                </div>
                <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-800 text-xs font-mono font-bold rounded-full self-start sm:self-auto">
                  REQUEST ID: {activeSOS.requestId}
                </span>
              </div>

              {/* Status Progression Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs font-bold">
                {[
                  { key: "Pending", label: "1. Submitted", icon: Clock },
                  { key: "Accepted", label: "2. Accepted", icon: CheckCircle2 },
                  { key: "Team On The Way", label: "3. Team En Route", icon: ShieldAlert },
                  { key: "Reached", label: "4. Reached Site", icon: MapPin },
                  { key: "Completed", label: "5. Rescued", icon: Sparkles },
                ].map((step) => {
                  const IconComp = step.icon;
                  const isCurrent = activeSOS.status === step.key;
                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-2xl border flex items-center justify-center gap-1.5 text-center transition-all ${
                        isCurrent
                          ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-950 scale-105 font-black"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span className="text-[11px]">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2-Column SOS Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Emergency Details Form & Big SOS Button */}
            <div className="lg:col-span-7 space-y-6">
              <EmergencyForm
                description={description}
                setDescription={setDescription}
                emergencyType={emergencyType}
                setEmergencyType={setEmergencyType}
                peopleAffected={peopleAffected}
                setPeopleAffected={setPeopleAffected}
              />

              <EmergencyButton onSendAlert={handleSendAlert} />
            </div>

            {/* Right Column (5 cols): Geolocation, AI Triage & Survival Tips */}
            <div className="lg:col-span-5 space-y-6">
              <LocationCard />
              <AIAnalysisCard emergencyType={emergencyType} peopleAffected={peopleAffected} />
              <SafetyGuidanceCard />
            </div>
          </div>

          {/* Bottom Security Info Card */}
          <SecurityInfoCard />
        </main>
      </div>

      {/* Confirmation Modal */}
      {showModal && activeSOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/40">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">Real-Time Firestore SOS Live!</h3>
                <p className="text-xs text-slate-400">Request ID: {activeSOS.requestId}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Category:</span>
                <span className="font-extrabold text-red-400">{activeSOS.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Priority Level:</span>
                <span className="px-2.5 py-0.5 bg-red-600 text-white rounded-md font-black">
                  {activeSOS.priority}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Status:</span>
                <span className="text-amber-400 font-bold uppercase">{activeSOS.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Live GPS Coordinates:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeSOS.latitude.toFixed(4)}°, {activeSOS.longitude.toFixed(4)}°
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-950/40 border border-blue-800/50 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200 leading-relaxed font-sans">
                Firestore onSnapshot listener active! Rescue Dashboard is receiving your live position updates in real time.
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
            >
              Close &amp; Monitor Real-Time Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
