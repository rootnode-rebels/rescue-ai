"use client";

import React, { useState } from "react";
import { completeFirstLoginPasswordChange } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, Lock, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const ForcePasswordChangeModal: React.FC = () => {
  const { userProfile, refreshProfile } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!userProfile || !userProfile.mustChangePassword) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      await completeFirstLoginPasswordChange(newPassword);
      setSuccessMsg("Password updated successfully! Welcome to RescueAI.");
      setTimeout(async () => {
        await refreshProfile();
      }, 1200);
    } catch (err: unknown) {
      console.error("Error updating password:", err);
      const msg = err instanceof Error ? err.message : "Failed to update password. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/40">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">First Login Required Step</h3>
            <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Set Your Permanent Account Password</p>
          </div>
        </div>

        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-2xl text-xs text-slate-300 space-y-1">
          <p className="font-bold text-white">Security Protocol Policy:</p>
          <p>
            Hello <strong>{userProfile.name}</strong> ({userProfile.role.toUpperCase()}). You signed in using a temporary access password. You must set your custom password before accessing your operational dashboard.
          </p>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                New Custom Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950 transition-all disabled:opacity-50 flex items-center justify-center gap-2 pt-1"
            >
              {loading ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save Password &amp; Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
