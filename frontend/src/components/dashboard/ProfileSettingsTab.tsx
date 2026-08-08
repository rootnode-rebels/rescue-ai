"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, HeartPulse, LogOut, CheckCircle2, Save, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileSettingsTabProps {
  mode: "profile" | "settings";
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ mode }) => {
  const { userProfile, logout } = useAuth();

  // Profile Edit State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+ Positive");
  const [medicalNotes, setMedicalNotes] = useState("No severe allergies. Inhaler carried.");
  const [contact1Name, setContact1Name] = useState("Rahul Sharma (Brother)");
  const [contact1Phone, setContact1Phone] = useState("+91 98765 11100");
  const [contact2Name, setContact2Name] = useState("Priya R (Spouse)");
  const [contact2Phone, setContact2Phone] = useState("+91 98765 22211");
  const [savedProfileNotice, setSavedProfileNotice] = useState(false);

  // Settings State
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [autoGps, setAutoGps] = useState(true);
  const [offlineSyncMode, setOfflineSyncMode] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProf = localStorage.getItem("rescueai_user_custom_profile");
      if (savedProf) {
        try {
          const parsed = JSON.parse(savedProf);
          setName(parsed.name || userProfile?.name || "Citizen User");
          setPhone(parsed.phone || userProfile?.phone || "+91 98765 43210");
          setBloodGroup(parsed.bloodGroup || "O+ Positive");
          setMedicalNotes(parsed.medicalNotes || "No severe allergies. Inhaler carried.");
          setContact1Name(parsed.contact1Name || "Rahul Sharma (Brother)");
          setContact1Phone(parsed.contact1Phone || "+91 98765 11100");
          setContact2Name(parsed.contact2Name || "Priya R (Spouse)");
          setContact2Phone(parsed.contact2Phone || "+91 98765 22211");
        } catch (e) {}
      } else {
        setName(userProfile?.name || "Citizen User");
        setPhone(userProfile?.phone || "+91 98765 43210");
      }
    }
  }, [userProfile]);

  const handleSaveProfile = () => {
    if (typeof window !== "undefined") {
      const payload = {
        name,
        phone,
        bloodGroup,
        medicalNotes,
        contact1Name,
        contact1Phone,
        contact2Name,
        contact2Phone,
      };
      localStorage.setItem("rescueai_user_custom_profile", JSON.stringify(payload));
      setSavedProfileNotice(true);
      setTimeout(() => setSavedProfileNotice(false), 2500);
    }
  };

  const handleSaveSettings = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  if (mode === "profile") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6 max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-red-600/30">
              {name?.charAt(0) || "C"}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{name || "Citizen User"}</h3>
              <p className="text-xs text-slate-500 font-medium">{userProfile?.email || "citizen@rescueai.org"}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-red-100 text-red-700 font-extrabold text-[10px] rounded-full uppercase">
                {userProfile?.role || "Citizen"} Profile
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedProfileNotice && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Profile Updated</span>
              </span>
            )}
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Profile Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Info */}
          <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-red-600" />
              <span>Personal Identification</span>
            </h4>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Medical Telemetry */}
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
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Medical Conditions / Allergies</label>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-red-500 resize-none h-14"
              />
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 md:col-span-2">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Emergency Contact Matrix</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <p className="text-[11px] font-bold text-slate-600">Primary Emergency Contact</p>
                <input
                  type="text"
                  placeholder="Contact Name & Relation"
                  value={contact1Name}
                  onChange={(e) => setContact1Name(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={contact1Phone}
                  onChange={(e) => setContact1Phone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <p className="text-[11px] font-bold text-slate-600">Secondary Emergency Contact</p>
                <input
                  type="text"
                  placeholder="Contact Name & Relation"
                  value={contact2Name}
                  onChange={(e) => setContact2Name(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={contact2Phone}
                  onChange={(e) => setContact2Phone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-600/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
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

        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Offline Storage Mode</h4>
            <p className="text-[11px] text-slate-500">Keep IndexedDB &amp; localStorage persistent sync active during cell network outages.</p>
          </div>
          <input
            type="checkbox"
            checked={offlineSyncMode}
            onChange={(e) => setOfflineSyncMode(e.target.checked)}
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
