"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  MapPin,
  CheckCircle2,
  Printer,
  Download,
  X,
  ShieldCheck,
  User,
  Mail,
  Users,
  AlertCircle,
  QrCode,
} from "lucide-react";
import { ShelterBookingRecord } from "@/services/authService";

interface ShelterInvoiceModalProps {
  booking: ShelterBookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShelterInvoiceModal: React.FC<ShelterInvoiceModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !booking) return null;

  const handlePrintOrDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 overflow-hidden printable-pass"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Official Pass Header */}
          <div className="flex items-center gap-3 pb-4 mb-5 border-b-2 border-dashed border-slate-200">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/30 shrink-0">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>OFFICIAL EVACUATION PASS</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                Shelter Reservation Receipt
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Receipt #{booking.bookingId} • National Emergency Grid
              </p>
            </div>
          </div>

          {/* Pass Body Content */}
          <div className="space-y-4">
            {/* Shelter Info */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-700">
                Reserved Shelter Destination
              </span>
              <h4 className="text-sm font-black text-blue-950 leading-snug">{booking.shelterName}</h4>
              <p className="text-xs text-blue-800 font-medium flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Sector Evacuation Zone • Central Grid Node</span>
              </p>
            </div>

            {/* Evacuee & Reservation Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Reserved By</span>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span className="truncate">{booking.userName}</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Registered Email</span>
                <p className="font-bold text-slate-900 flex items-center gap-1 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">{booking.userEmail}</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Evacuee Count</span>
                <p className="font-black text-slate-900 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>{booking.evacueeCount} Persons Reserved</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Assistance Required</span>
                <p className="font-bold text-slate-900">
                  {booking.specialAssistance ? (
                    <span className="text-amber-700 font-extrabold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Medical / Wheelchair
                    </span>
                  ) : (
                    <span className="text-slate-600">Standard Evacuee</span>
                  )}
                </p>
              </div>
            </div>

            {/* Check-In Barcode / QR Simulation */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  Check-In Security Barcode
                </span>
                <p className="text-xs font-mono font-bold text-emerald-400">STATUS: CONFIRMED &amp; GUARANTEED</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Booked: {new Date(booking.bookedAt).toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-white rounded-xl shrink-0">
                <QrCode className="w-10 h-10 text-slate-950" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-5 mt-5 border-t border-slate-100 print:hidden">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              Close Pass
            </button>
            <button
              onClick={handlePrintOrDownload}
              disabled={downloading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Print / Download PDF Pass</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
