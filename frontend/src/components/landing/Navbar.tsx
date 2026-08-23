"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Menu, X, PhoneCall } from "lucide-react";
import { EmergencySOSModal } from "./EmergencySOSModal";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Technology", href: "#technology" },
    { name: "Why RescueAI", href: "#why-rescueai" },
    { name: "Contact", href: "#footer" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 h-[80px] bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Left: RescueAI Logo */}
            <Link
              href="/"
              className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-2xl p-1"
              aria-label="RescueAI Home"
            >
              <div className="relative flex items-center justify-center w-12 h-12 bg-slate-900 rounded-2xl text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                <ShieldAlert className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                  Rescue<span className="text-red-600">AI</span>
                </span>
                <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-slate-500">
                  Emergency Platform
                </span>
              </div>
            </Link>

            {/* Center: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right: Login, Register, Emergency SOS */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Login Button */}
              <Link
                href="/login"
                className="px-5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 rounded-full transition-all duration-200"
              >
                Login
              </Link>

              {/* Register Button */}
              <Link
                href="/register"
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-all duration-200 shadow-md"
              >
                Register
              </Link>

              {/* Crucial Exception: Striking Red Emergency SOS Button */}
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="relative group overflow-hidden px-6 py-2.5 text-xs font-black text-white bg-red-600 hover:bg-red-500 rounded-full shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2 uppercase tracking-wider"
                aria-label="Emergency SOS Request"
              >
                <PhoneCall className="w-4 h-4 text-white animate-bounce relative z-10" />
                <span className="relative z-10">Emergency SOS</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="px-4 py-2 text-xs font-black text-white bg-red-600 rounded-full shadow-md shadow-red-600/40 flex items-center gap-1.5 uppercase"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>SOS</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-[80px] left-0 right-0 bg-white border-b border-slate-200 px-6 pt-4 pb-8 space-y-3 shadow-xl">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-full"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-bold text-white bg-slate-900 rounded-full"
              >
                Register Citizen Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Emergency SOS Modal */}
      <EmergencySOSModal isOpen={isSosModalOpen} onClose={() => setIsSosModalOpen(false)} />
    </>
  );
};

