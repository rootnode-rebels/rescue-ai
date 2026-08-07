"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  User,
  Users,
  Heart,
  Brain,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { SOSRequest, PriorityLevel, SOSStatus } from "@/types";

interface IncidentCardProps {
  request: SOSRequest;
  onAccept?: (id: string) => void;
  onComplete?: (id: string) => void;
  onViewDetails?: (request: SOSRequest) => void;
  isRescueView?: boolean;
}

const PRIORITY_STYLES: Record<PriorityLevel, { bg: string; text: string; border: string; label: string }> = {
  CRITICAL: {
    bg: "bg-red-600/10 dark:bg-red-950/60",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    label: "CRITICAL PRIORITY",
  },
  HIGH: {
    bg: "bg-orange-600/10 dark:bg-orange-950/60",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
    label: "HIGH PRIORITY",
  },
  MEDIUM: {
    bg: "bg-amber-600/10 dark:bg-amber-950/60",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    label: "MEDIUM PRIORITY",
  },
  LOW: {
    bg: "bg-emerald-600/10 dark:bg-emerald-950/60",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    label: "LOW PRIORITY",
  },
};

const STATUS_STYLES: Record<SOSStatus, { bg: string; text: string }> = {
  PENDING: { bg: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300", text: "PENDING DISPATCH" },
  ACCEPTED: { bg: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300", text: "RESCUE DISPATCHED" },
  IN_PROGRESS: { bg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300", text: "IN PROGRESS" },
  COMPLETED: { bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300", text: "RESOLVED" },
  CANCELLED: { bg: "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300", text: "CANCELLED" },
};

export const IncidentCard: React.FC<IncidentCardProps> = ({
  request,
  onAccept,
  onComplete,
  onViewDetails,
  isRescueView = false,
}) => {
  const priorityStyle = PRIORITY_STYLES[request.priority] || PRIORITY_STYLES.MEDIUM;
  const statusStyle = STATUS_STYLES[request.status] || STATUS_STYLES.PENDING;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border backdrop-blur-xl shadow-xs transition-all ${priorityStyle.border}`}
    >
      {/* Header Badges */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
        >
          {priorityStyle.label}
        </span>
        <div className="flex items-center gap-2">
          {request.isOfflineCreated && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              OFFLINE SYNC
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusStyle.bg}`}>
            {statusStyle.text}
          </span>
        </div>
      </div>

      {/* Title & Category */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-black text-gray-900 dark:text-slate-100 capitalize">
            {request.category.toLowerCase()} Emergency
          </h4>
          <span className="text-xs font-mono font-medium text-gray-400">#{request.id.slice(0, 6)}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 mt-1 font-medium leading-relaxed">
          {request.description}
        </p>
      </div>

      {/* AI Executive Summary Badge */}
      {request.aiSummary && (
        <div className="mb-4 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
          <Brain className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[10px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
              AI Triage Summary:
            </span>
            <p className="font-medium mt-0.5 leading-snug">{request.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <User className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{request.userName}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <Users className="w-3.5 h-3.5 text-gray-400" />
          <span>{request.peopleCount} Affected</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <Heart className={`w-3.5 h-3.5 ${request.medicalNeeds ? "text-red-500" : "text-gray-400"}`} />
          <span>{request.medicalNeeds ? "Medical Needed" : "No Injury"}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium col-span-2 sm:col-span-3">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate">
            {request.location.address || `${request.location.latitude.toFixed(4)}, ${request.location.longitude.toFixed(4)}`}
          </span>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="pt-2 flex items-center justify-between gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(request)}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}

        {isRescueView && (
          <div className="flex items-center gap-2 ml-auto">
            {request.userPhone && (
              <a
                href={`tel:${request.userPhone}`}
                className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                title="Call Victim"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            )}

            {request.status === "PENDING" && onAccept && (
              <button
                onClick={() => onAccept(request.id)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md shadow-red-600/30 transition-all"
              >
                Accept SOS
              </button>
            )}

            {request.status === "ACCEPTED" && onComplete && (
              <button
                onClick={() => onComplete(request.id)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Resolved</span>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
