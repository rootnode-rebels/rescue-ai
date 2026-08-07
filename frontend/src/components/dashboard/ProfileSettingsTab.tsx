"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, ShieldCheck, HeartPulse, Bell, Moon, Sun, Globe, LogOut, CheckCircle2, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileSettingsTabProps {
  mode: "profile" | "settings";
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ mode }) => {
  const { userProfile, logout } = useAuth();
  const [bloodGroup, setBloodGroup] = useState("O+ Positive");
  const [medicalNotes, setMedicalNotes] = useState("No severe allergies. Asthma inhaler carried.");
  const [emergencyContacts] = useState([
    { name: "Rahul Sharma (Brother)", phone: "+91 98765 11100" },
    { name: "Priya R (Spouse)", phone: "+91 98765 22211" },
  ]);

  // Settings states
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [autoGps, setAutoGps] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  if (mode === "profile") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6 max-w-4xl mx-auto"
      >
        {/* Profile Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-red-600/30">
              {userProfile?.name?.charAt(0) || "C"}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{userProfile?.name || "Citizen User"}</h3>
              <p className="text-xs text-slate-500 font-medium">{userProfile?.email || "citizen@rescueai.org"}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-red-100 text-red-700 font-extrabold text-[10px] rounded-full uppercase">
                {userProfile?.role || "Citizen"} Profile
              </span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Profile Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1: Medical Telemetry */}
          <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>Medical &amp; Triage Telemetry</span>
            </h4>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Blood Group</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Pre-Existing Conditions / Allergies</label>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-red-500 resize-none h-20"
              />
            </div>
          </div>

          {/* Box 2: Emergency Contacts */}
          <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Emergency Contact Matrix</span>
            </h4>
            <div className="space-y-2">
              {emergencyContacts.map((contact, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{contact.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{contact.phone}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md">VERIFIED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-base font-black text-slate-900">Application &amp; Security Settings</h3>
        {savedNotice && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900">SMS Disaster Broadcasts</h4>
            <p className="text-[11px] text-slate-500">Receive instant SMS alerts during critical flood/cyclone warnings.</p>
          </div>
          <input
            type="checkbox"
            checked={smsAlerts}
            onChange={(e) => setSmsAlerts(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
          />
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Push Notifications</h4>
            <p className="text-[11px] text-slate-500">Enable real-time browser push notifications for emergency team dispatches.</p>
          </div>
          <input
            type="checkbox"
            checked={pushAlerts}
            onChange={(e) => setPushAlerts(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
          />
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Automatic Live GPS Telemetry</h4>
            <p className="text-[11px] text-slate-500">Automatically stream high-precision GPS to first responders upon SOS dispatch.</p>
          </div>
          <input
            type="checkbox"
            checked={autoGps}
            onChange={(e) => setAutoGps(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={handleSaveSettings}
        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all uppercase tracking-wider"
      >
        Save Settings Preferences
      </button>
    </motion.div>
  );
};
