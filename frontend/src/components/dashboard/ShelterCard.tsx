"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, MapPin, CheckCircle2, ArrowRight, X } from "lucide-react";
import { bookShelterSpotInFirestore, ShelterBookingRecord } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";

interface ShelterItem {
  id: string;
  name: string;
  address: string;
  distance: string;
  capacity: number;
  occupied: number;
  phone: string;
  facilities: string[];
}

<<<<<<< HEAD
export const ShelterCard: React.FC = () => {
  const { userProfile } = useAuth();
=======
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, MapPin, CheckCircle2, ArrowRight, X, Printer, Download } from "lucide-react";
import { bookShelterSpotInFirestore, ShelterBookingRecord } from "@/services/authService";
import { ShelterInvoiceModal } from "./ShelterInvoiceModal";
import { useAuth } from "@/hooks/useAuth";

interface ShelterItem {
  id: string;
  name: string;
  address: string;
  distance: string;
  capacity: number;
  occupied: number;
  phone: string;
  facilities: string[];
}

const DEFAULT_SHELTERS: ShelterItem[] = [
  {
    id: "shelter-01",
    name: "Central Evacuation Relief Shelter",
    address: "102 Disaster Response Ave, Sector 4",
    distance: "0.8 miles away",
    capacity: 250,
    occupied: 185,
    phone: "+91 98765 11223",
    facilities: ["Food & Clean Water", "Medical Node", "Backup Generator", "Pet Safe Zone"],
  },
  {
    id: "shelter-02",
    name: "St. Jude Community Arena",
    address: "405 High Street, Downtown",
    distance: "1.4 miles away",
    capacity: 500,
    occupied: 310,
    phone: "+91 98765 44332",
    facilities: ["Red Cross Paramedics", "Infant Care", "Evacuation Shuttles"],
  },
  {
    id: "shelter-03",
    name: "North Grid High School Complex",
    address: "88 Coastal Highway, Bay Area",
    distance: "2.1 miles away",
    capacity: 350,
    occupied: 120,
    phone: "+91 98765 99887",
    facilities: ["Helipad Access", "Emergency Kitchen", "Sanitation Kits"],
  },
];

export const ShelterCard: React.FC = () => {
  const { userProfile } = useAuth();
  const [shelters, setShelters] = useState<ShelterItem[]>(DEFAULT_SHELTERS);
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
  const [selectedShelter, setSelectedShelter] = useState<ShelterItem | null>(null);
  const [evacueeCount, setEvacueeCount] = useState<number>(1);
  const [specialAssistance, setSpecialAssistance] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeBooking, setActiveBooking] = useState<ShelterBookingRecord | null>(null);
<<<<<<< HEAD

  const shelters: ShelterItem[] = [
    {
      id: "shelter-01",
      name: "Central Evacuation Relief Shelter",
      address: "102 Disaster Response Ave, Sector 4",
      distance: "0.8 miles away",
      capacity: 250,
      occupied: 185,
      phone: "+91 98765 11223",
      facilities: ["Food & Clean Water", "Medical Node", "Backup Generator", "Pet Safe Zone"],
    },
    {
      id: "shelter-02",
      name: "St. Jude Community Arena",
      address: "405 High Street, Downtown",
      distance: "1.4 miles away",
      capacity: 500,
      occupied: 310,
      phone: "+91 98765 44332",
      facilities: ["Red Cross Paramedics", "Infant Care", "Evacuation Shuttles"],
    },
    {
      id: "shelter-03",
      name: "North Grid High School Complex",
      address: "88 Coastal Highway, Bay Area",
      distance: "2.1 miles away",
      capacity: 350,
      occupied: 120,
      phone: "+91 98765 99887",
      facilities: ["Helipad Access", "Emergency Kitchen", "Sanitation Kits"],
    },
  ];
=======
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);

  // Load persistent shelter occupancy state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rescueai_shelters_state");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as ShelterItem[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setShelters(parsed);
          }
        } catch (e) {
          console.warn("Shelter state load error:", e);
        }
      }
    }
  }, []);
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)

  const handleConfirmBooking = async () => {
    if (!selectedShelter) return;
    setLoading(true);
    try {
      const receipt = await bookShelterSpotInFirestore({
        shelterId: selectedShelter.id,
        shelterName: selectedShelter.name,
        userEmail: userProfile?.email || "citizen@rescueai.org",
        userName: userProfile?.name || "Citizen Evacuee",
        evacueeCount: evacueeCount,
        specialAssistance: specialAssistance,
      });
<<<<<<< HEAD
      setActiveBooking(receipt);
=======

      // Update local reactive occupancy state (decrement remaining spots in real-time)
      const updatedList = shelters.map((item) => {
        if (item.id === selectedShelter.id) {
          const newOccupied = Math.min(item.capacity, item.occupied + evacueeCount);
          return { ...item, occupied: newOccupied };
        }
        return item;
      });

      setShelters(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem("rescueai_shelters_state", JSON.stringify(updatedList));
      }

      setActiveBooking(receipt);
      setIsBannerDismissed(false);
      setIsInvoiceOpen(true); // Automatically open printable pass modal
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
    } catch (e) {
      console.warn("Booking error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      {/* Active Booking Confirmation Card */}
      {activeBooking && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Evacuation Spot Confirmed!</span>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-full">
              Receipt #{activeBooking.bookingId}
            </span>
          </div>
          <p className="text-xs text-emerald-700 font-medium">
            Reserved spot for <strong>{activeBooking.evacueeCount} evacuee(s)</strong> at <strong>{activeBooking.shelterName}</strong>. Show this receipt upon arrival for instant check-in.
          </p>
=======
      {/* Active Booking Compact Banner with Instant Dismiss */}
      {activeBooking && !isBannerDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5 shadow-sm relative"
        >
          <button
            onClick={() => setIsBannerDismissed(true)}
            className="absolute top-3 right-3 p-1 text-emerald-700 hover:text-emerald-950 rounded-lg hover:bg-emerald-100 transition-colors"
            title="Dismiss notification to save space"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Evacuation Spot Confirmed!</span>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] rounded-full">
              #{activeBooking.bookingId}
            </span>
          </div>

          <p className="text-xs text-emerald-800 font-medium">
            Reserved spot for <strong>{activeBooking.evacueeCount} evacuee(s)</strong> at <strong>{activeBooking.shelterName}</strong>.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1.5 transition-colors shadow-xs uppercase tracking-wider"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>View &amp; Download Printable Pass</span>
            </button>
            <button
              onClick={() => setIsBannerDismissed(true)}
              className="px-3 py-1.5 bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-xl hover:bg-emerald-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
        </motion.div>
      )}

      {/* Main Shelter Grid Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Verified Evacuation Relief Shelters</h3>
<<<<<<< HEAD
              <p className="text-xs text-slate-500 font-medium">Real-Time Occupancy &amp; Evacuation Spot Reservations</p>
=======
              <p className="text-xs text-slate-500 font-medium">Real-Time Capacity &amp; Instant Spot Reservations</p>
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full">
            {shelters.length} Shelters Open
          </span>
        </div>

        {/* Shelter Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shelters.map((shelter) => {
<<<<<<< HEAD
            const openSpots = shelter.capacity - shelter.occupied;
=======
            const openSpots = Math.max(0, shelter.capacity - shelter.occupied);
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
            const pct = Math.round((shelter.occupied / shelter.capacity) * 100);

            return (
              <div
                key={shelter.id}
                className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-4 hover:bg-white hover:shadow-lg transition-all duration-200 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {shelter.name}
                    </h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full shrink-0">
                      OPEN
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{shelter.address}</span>
                  </p>

                  <p className="text-[11px] text-slate-500 font-medium">{shelter.distance}</p>

<<<<<<< HEAD
                  {/* Occupancy Meter */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Occupancy ({pct}%)</span>
                      <span className="text-emerald-700">{openSpots} Spots Left</span>
=======
                  {/* Real-time Occupancy Meter & Dynamic Remaining Spots */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Occupancy ({pct}%)</span>
                      <span className={openSpots > 0 ? "text-emerald-700 font-black animate-pulse" : "text-red-600 font-black"}>
                        {openSpots > 0 ? `${openSpots} Spots Left` : "FULL CAPACITY"}
                      </span>
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
<<<<<<< HEAD
                          pct > 80 ? "bg-amber-500" : "bg-emerald-500"
=======
                          pct >= 90 ? "bg-red-600" : pct > 75 ? "bg-amber-500" : "bg-emerald-500"
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Facility Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {shelter.facilities.map((fac) => (
                      <span
                        key={fac}
                        className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-semibold rounded-md"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedShelter(shelter)}
<<<<<<< HEAD
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 uppercase"
                >
                  <span>Book Evacuation Spot</span>
=======
                  disabled={openSpots <= 0}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 uppercase disabled:cursor-not-allowed"
                >
                  <span>{openSpots > 0 ? "Book Evacuation Spot" : "Shelter Full"}</span>
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

<<<<<<< HEAD
      {/* Booking Modal */}
=======
      {/* Booking Form Modal */}
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
      <AnimatePresence>
        {selectedShelter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Book Evacuation Spot</h3>
                </div>
                <button onClick={() => setSelectedShelter(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-1">
                <h4 className="text-xs font-black text-blue-950">{selectedShelter.name}</h4>
                <p className="text-[11px] text-blue-800">{selectedShelter.address}</p>
<<<<<<< HEAD
                <p className="text-[10px] text-blue-600 font-bold">{selectedShelter.distance}</p>
=======
                <p className="text-[10px] text-blue-600 font-bold">
                  Remaining Capacity: {selectedShelter.capacity - selectedShelter.occupied} Spots Available
                </p>
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Evacuees</label>
                  <select
                    value={evacueeCount}
                    onChange={(e) => setEvacueeCount(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Evacuee(s)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    id="special-assistance"
                    type="checkbox"
                    checked={specialAssistance}
                    onChange={(e) => setSpecialAssistance(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="special-assistance" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                    Requires Special Medical / Wheelchair Assistance
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedShelter(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleConfirmBooking();
                    setSelectedShelter(null);
                  }}
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider"
                >
<<<<<<< HEAD
                  Confirm Reservation
=======
                  {loading ? "Reserving..." : "Confirm Reservation"}
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
<<<<<<< HEAD
    </div>
  );
};
=======

      {/* Printable Evacuation Pass & Invoice Modal */}
      <ShelterInvoiceModal
        booking={activeBooking}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};

>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
