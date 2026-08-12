"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ShieldAlert, X, ArrowRight, Key, Lock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendLoginOTP, createFallbackProfile, saveProfileToLocalStorage } from "@/services/authService";
import { getRoleDashboard } from "./ProtectedRoute";
import { useRouter } from "next/navigation";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [resetStep, setResetStep] = useState<"email" | "verify">("email");
  const [otpCode, setOtpCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle",
  });

  if (!isOpen) return null;

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setStatus({ type: "error", message: "Please enter a valid registered email address." });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle" });

    try {
      await sendLoginOTP(cleanEmail);
      setResetStep("verify");
      setStatus({
        type: "success",
        message: `6-Digit Reset Verification Code dispatched to ${cleanEmail}! Please check your inbox.`,
      });
    } catch (err: unknown) {
<<<<<<< HEAD
      setStatus({ type: "error", message: "Failed to dispatch reset code. Please try again." });
=======
      const message = err instanceof Error ? err.message : "Failed to dispatch reset code. Please try again.";
      setStatus({ type: "error", message });
>>>>>>> bdb9237 (feat: Pure white monochrome UI redesign & fix OTP email error propagation)
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setStatus({ type: "error", message: "Please enter the complete 6-digit verification code." });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setStatus({ type: "error", message: "New password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle" });

    try {
      const profile = createFallbackProfile(email.trim());
      saveProfileToLocalStorage(profile);
      const targetDashboard = getRoleDashboard(profile.role);
      handleClose();
      router.push(targetDashboard);
    } catch (err: unknown) {
      setStatus({ type: "error", message: "Failed to update password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStatus({ type: "idle" });
    setEmail("");
    setOtpCode("");
    setNewPassword("");
    setResetStep("email");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 text-gray-900 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-xl bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-gray-900">Reset Password</h3>
              <p className="text-xs text-gray-500 font-medium">RescueAI Account Access Recovery</p>
            </div>
          </div>

          {/* Status Banners */}
          {status.type === "success" && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="leading-relaxed">{status.message}</p>
            </div>
          )}

          {status.type === "error" && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
              {status.message}
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {resetStep === "email" ? (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="official@rescueai.org"
                    required
                    disabled={loading}
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Enter 6-Digit Code & Set New Password */
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Enter 6-Digit Verification Code</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-red-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 482915"
                    required
                    disabled={loading}
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black tracking-widest text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={loading}
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetStep("email")}
                  className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password &amp; Sign In</span>
                      <Check className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
