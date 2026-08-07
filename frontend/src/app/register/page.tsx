import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Citizen Account – RescueAI Emergency Coordination Platform",
  description: "Register for a RescueAI Citizen Account for real-time disaster alerts, one-tap SOS, and emergency coordination.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-red-50/40 to-blue-50/40 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Soft Blurred Background Flares */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-300/5 rounded-full blur-3xl pointer-events-none" />

      {/* Registration Form Container */}
      <RegisterForm />
    </main>
  );
}
