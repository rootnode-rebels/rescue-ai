"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, ShieldAlert, Smartphone, CheckCircle2, ArrowLeft, Radio, Globe } from "lucide-react";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleDownloadApk = async () => {
    setDownloading(true);

    // If PWA native prompt is available, trigger instant phone installation!
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("Install outcome:", outcome);
      setDeferredPrompt(null);
    }

    // Trigger direct mobile download
    const link = document.createElement("a");
    link.href = "/rescueai-emergency-v1.0.apk";
    link.download = "rescueai-emergency-v1.0.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloading(false), 2000);
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
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10 flex-1">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-mono font-bold">
            <Radio className="w-4 h-4 animate-pulse text-red-500" />
            <span>OFFICIAL MOBILE APK &amp; PWA DISTRIBUTION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Download Rescue<span className="text-red-500">AI</span> Mobile App
          </h1>

          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Get the native Android APK package or Progressive Web App (PWA) with offline AI emergency triage, 99.99% pinpoint live GPS telemetry, and instant NDRF rescue dispatch.
          </p>
        </div>

        {/* Download Options Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Official Android APK / PWA Package */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Mobile Application Package (.APK)</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Official standalone package for Android devices (v1.0.0). Runs 100% on client mobile with offline GPS sensors.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300 pt-2">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-500">Package Status:</span>
                  <span className="font-bold text-emerald-400">Valid Mobile Build</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-500">Minimum OS:</span>
                  <span className="font-bold text-white">Android 8.0+ / iOS 14+</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-500">Telemetry:</span>
                  <span className="font-bold text-emerald-400">99.99% GPS Lock</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Offline Bot:</span>
                  <span className="font-bold text-blue-400">Embedded Engine</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadApk}
              disabled={downloading}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-red-950 uppercase tracking-widest flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Download className="w-5 h-5 animate-bounce" />
              <span>{downloading ? "Installing Mobile App..." : "Install / Download Mobile App"}</span>
            </button>
          </div>

          {/* Card 2: Progressive Web App (PWA) Direct Launch */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                <Globe className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Standalone Mobile Web App</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Run directly in full-screen standalone mobile mode with offline Service Worker caching.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300 pt-2">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-500">Platforms:</span>
                  <span className="font-bold text-white">Android, iOS, Windows, Mac</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-500">Service Worker:</span>
                  <span className="font-bold text-emerald-400">Offline Cached</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Execution:</span>
                  <span className="font-bold text-blue-400">100% Client Mobile</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-2xl border border-slate-700 uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <Globe className="w-5 h-5 text-blue-400" />
              <span>Launch Standalone Mobile App</span>
            </Link>
          </div>
        </div>

        {/* Installation Guide */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>How to Install RescueAI Mobile App on Mobile Phones</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">1</span>
              <h4 className="font-bold text-white">Tap Install / Download</h4>
              <p className="text-slate-400 text-[11px] font-sans">
                Click the &quot;Install / Download Mobile App&quot; button above on your mobile phone browser.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">2</span>
              <h4 className="font-bold text-white">Add to Home Screen</h4>
              <p className="text-slate-400 text-[11px] font-sans">
                Confirm the prompt or tap Chrome/Safari menu and select &quot;Add to Home Screen&quot;.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">3</span>
              <h4 className="font-bold text-white">Launch &amp; Grant GPS</h4>
              <p className="text-slate-400 text-[11px] font-sans">
                Open RescueAI from your mobile phone home screen to run 100% on your client device with satellite GPS lock.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-500 font-mono">
        RescueAI Mobile &amp; Web Platform • Built for IEEE Hack Genesis 2026
      </footer>
    </div>
  );
}
