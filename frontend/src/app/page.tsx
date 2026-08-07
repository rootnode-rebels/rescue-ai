import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Comparison } from "@/components/landing/Comparison";
import { Technology } from "@/components/landing/Technology";
import { BottomSection } from "@/components/landing/BottomSection";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "RescueAI – AI-Powered Disaster Response & Emergency Coordination Platform",
  description:
    "RescueAI is an AI-powered disaster response and emergency coordination platform enabling zero-latency SOS broadcasts, Gemini AI triage, and real-time rescue dispatch.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-red-500 selection:text-white">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Flow */}
      <main>
        {/* Dark Hero Section */}
        <Hero />

        {/* Floating Stats Bar Container */}
        <StatsBar />

        {/* Powerful Features Grid */}
        <Features />

        {/* 6-Step How It Works Workflow Timeline */}
        <HowItWorks />

        {/* 2-Column Side-by-Side Comparison */}
        <Comparison />

        {/* Tech Architecture Cards Grid */}
        <Technology />

        {/* Three Premium Cards Bottom Section */}
        <BottomSection />
      </main>

      {/* Dark Footer */}
      <Footer />
    </div>
  );
}
