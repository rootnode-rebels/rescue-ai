"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Comparison } from "@/components/landing/Comparison";
import { Technology } from "@/components/landing/Technology";
import { BottomSection } from "@/components/landing/BottomSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  const { userProfile, currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Instagram-style redirect: If user is logged in, redirect directly to their dashboard
    if (!loading && (userProfile || currentUser)) {
      const targetRole = userProfile?.role || "citizen";
      if (targetRole === "citizen") {
        router.replace("/dashboard");
      } else {
        router.replace("/rescue-dashboard");
      }
    }
  }, [userProfile, currentUser, loading, router]);

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
