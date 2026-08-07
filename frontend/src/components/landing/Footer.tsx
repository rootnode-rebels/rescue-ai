"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Mail, Phone, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-[#08101D] text-slate-400 border-t border-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-900">
          {/* Column 1 & 2: Larger Logo & Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-600/30">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Rescue<span className="text-red-500">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              RescueAI is an AI-powered disaster response and emergency coordination platform designed for instant SOS broadcasting, multimodal AI triage, and real-time dispatch.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Network Operational
              </span>
              <span>•</span>
              <span>v1.0 Hackathon Build</span>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#hero" className="hover:text-red-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-red-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-red-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-red-400 transition-colors">
                  Technology Stack
                </a>
              </li>
              <li>
                <a href="#why-rescueai" className="hover:text-red-400 transition-colors">
                  Why RescueAI
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources & Portals */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
              Resources &amp; Teams
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/login" className="hover:text-red-400 transition-colors">
                  Citizen Portal Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-red-400 transition-colors">
                  Register Citizen Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-red-400 transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link href="/rescue-dashboard" className="hover:text-red-400 transition-colors">
                  Rescue Team Grid
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-red-400 transition-colors">
                  EOC Command Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact & Social Icons */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
              Contact &amp; Social
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>support@rescueai.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>+1 (800) RESCUE-AI</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>National EOC Command Center</span>
              </div>

              {/* Social Icons */}
              <div className="pt-3 flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Repository"
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter X"
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RescueAI Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Security Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
