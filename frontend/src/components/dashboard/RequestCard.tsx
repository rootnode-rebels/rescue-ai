"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export const RequestCard: React.FC = () => {
  const requests = [
    {
      id: "SOS #8492",
      type: "Flood Evacuation",
      status: "Accepted",
      statusStyle: "bg-emerald-100 text-emerald-700 border-emerald-200",
      assigned: "Coast Guard Team #4",
      time: "10 mins ago",
      eta: "3 Mins",
      location: "San Francisco Harbor",
    },
    {
      id: "SOS #8310",
      type: "Power Grid Outage",
      status: "Resolved",
      statusStyle: "bg-blue-100 text-blue-700 border-blue-200",
      assigned: "City Utility Squad #12",
      time: "Yesterday",
      eta: "Completed",
      location: "Sector 4 North",
    },
    {
      id: "SOS #8105",
      type: "Medical Support Request",
      status: "Resolved",
      statusStyle: "bg-slate-100 text-slate-700 border-slate-200",
      assigned: "Paramedic Unit #2",
      time: "3 days ago",
      eta: "Completed",
      location: "Downtown Medical Node",
    },
  ];

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
          <span>My Emergency Requests</span>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">
            {requests.length}
          </span>
        </h3>
        <a href="#all-requests" className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
          View All History
        </a>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:bg-white hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                  <Flame className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-black text-slate-900">{req.id}</span>
                <span className="text-xs text-slate-500 font-medium">• {req.type}</span>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${req.statusStyle}`}>
                {req.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1 font-mono">
              <span>Assigned: <strong className="text-slate-900 font-bold">{req.assigned}</strong></span>
              <span className="text-emerald-600 font-bold">ETA: {req.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
