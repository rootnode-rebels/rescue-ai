"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus, FileText, AlertTriangle, Users } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { VoiceRecorderPlaceholder } from "./VoiceRecorderPlaceholder";

interface EmergencyFormProps {
  description: string;
  setDescription: (val: string) => void;
  emergencyType: string;
  setEmergencyType: (val: string) => void;
  peopleAffected: number;
  setPeopleAffected: (val: number) => void;
}

export const EmergencyForm: React.FC<EmergencyFormProps> = ({
  description,
  setDescription,
  emergencyType,
  setEmergencyType,
  peopleAffected,
  setPeopleAffected,
}) => {
  const emergencyTypes = [
    "Flood",
    "Fire",
    "Earthquake",
    "Medical Emergency",
    "Road Accident",
    "Landslide",
    "Cyclone",
    "Other",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6"
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
        <div className="p-2.5 bg-red-50 text-red-600 rounded-2xl border border-red-100">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900">Emergency Details</h3>
          <p className="text-xs text-gray-500 font-medium">
            Fill in details to help AI categorize your distress priority.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Emergency Type Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Type of Emergency <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium transition-all appearance-none"
            >
              {emergencyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-700">
              Emergency Description <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-gray-400">
              {description.length}/500
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            rows={4}
            placeholder="Describe your current situation, water level, injuries, trapped occupants, or immediate hazards..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium transition-all"
          />
        </div>

        {/* People Affected Stepper */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Number of People Affected
          </label>
          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-bold text-gray-900">
                {peopleAffected} {peopleAffected === 1 ? "Person" : "People"} Trapped / Affected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPeopleAffected(Math.max(1, peopleAffected - 1))}
                className="w-9 h-9 bg-white hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 flex items-center justify-center font-bold transition-all shadow-xs"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-black text-gray-900 font-mono">
                {peopleAffected}
              </span>
              <button
                type="button"
                onClick={() => setPeopleAffected(peopleAffected + 1)}
                className="w-9 h-9 bg-white hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 flex items-center justify-center font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Uploader */}
        <ImageUploader />

        {/* Voice Recorder */}
        <VoiceRecorderPlaceholder />
      </div>
    </motion.div>
  );
};
