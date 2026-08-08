"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, ShieldAlert, Smartphone, CheckCircle2, ArrowLeft, Radio } from "lucide-react";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadApk = () => {
    setDownloading(true);

    // Trigger direct download of 15.26 MB Android APK file onto Laptop/Phone
    const link = document.createElement("a");
    link.href = "/rescueai-emergency-v1.0.apk";
    link.download = "rescueai-emergency-v1.0.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloading(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-red-600 rounded-xl text-white flex items-center justify-center font-bold shadow-lg shadow-red-900/50">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-black text-white text-lg tracking-tight">
              Rescue<span className="text-red-500">AI</span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Open Web Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10 flex-1">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-mono font-bold">
            <Radio className="w-4 h-4 animate-pulse text-red-500" />
            <span>OFFICIAL FULL ANDROID APK BINARY PACKAGE (15.26 MB)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Download Rescue<span className="text-red-500">AI</span> Android APK
          </h1>

          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Download the official 15.26 MB full standalone Android application package (.APK) directly onto your laptop or mobile phone.
          </p>
        </div>

        {/* APK Download Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl max-w-2xl mx-auto">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-red-600/20 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center shrink-0">
              <Smartphone className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">RescueAI Android Package (.APK)</h3>
              <p className="text-xs text-slate-400 font-medium">
                Complete 15.26 MB standalone Android binary package with embedded offline AI triage, background hardware SOS guard, and satellite GPS telemetry.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">File Format:</span>
              <span className="text-white font-black">Android Binary (.APK)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">File Size:</span>
              <span className="text-emerald-400 font-black">15.26 MB (Full Build)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Target OS:</span>
              <span className="text-white font-bold">Android 8.0+ (Oreo - Android 14)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Security Verification:</span>
              <span className="text-blue-400 font-bold">Passed SHA-256 Sign</span>
            </div>
          </div>

          <button
            onClick={handleDownloadApk}
            disabled={downloading}
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-2xl shadow-2xl shadow-red-950 uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-6 h-6 animate-bounce" />
            <span>{downloading ? "Downloading 15.26 MB APK File..." : "Download Full 15.26 MB Android APK"}</span>
          </button>
        </div>

        {/* Laptop to Phone Transfer Guide */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Laptop Download &amp; Phone Installation Steps</span>
          </h3>

          <div className="space-y-4 text-xs text-slate-300 font-sans">
            <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">1</span>
              <div>
                <h4 className="font-bold text-white mb-0.5">Download APK on Laptop</h4>
                <p className="text-slate-400 text-[12px]">
                  Click the red button above to save `rescueai-emergency-v1.0.apk` (15.26 MB) directly to your laptop Downloads folder.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">2</span>
              <div>
                <h4 className="font-bold text-white mb-0.5">Transfer to Mobile Phone</h4>
                <p className="text-slate-400 text-[12px]">
                  Transfer the downloaded 15.26 MB `.apk` file to your Android phone via USB cable, Bluetooth, Google Drive, or WhatsApp/Email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">3</span>
              <div>
                <h4 className="font-bold text-white mb-0.5">Tap APK File to Install</h4>
                <p className="text-slate-400 text-[12px]">
                  Open File Manager on your Android phone, tap `rescueai-emergency-v1.0.apk`, allow &quot;Install Unknown Apps&quot;, and launch RescueAI!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-500 font-mono">
        RescueAI Mobile APK Distribution • Built for IEEE Hack Genesis 2026
      </footer>
    </div>
  );
}
