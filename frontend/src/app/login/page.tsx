import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In – RescueAI Emergency Coordination Platform",
  description: "Access the RescueAI Emergency Coordination Command Center to manage SOS alerts and rescue dispatch.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-red-50/40 to-blue-50/40 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Soft Blurred Background Flares */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-300/5 rounded-full blur-3xl pointer-events-none" />

      {/* Login Form Container */}
      <LoginForm />
    </main>
  );
}
