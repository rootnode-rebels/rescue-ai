"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Mail, CheckCircle2, ShieldAlert, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message?: string }>({
    type: "idle",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setStatus({ type: "loading" });

    try {
      // 1. Firebase Auth reset password email link
      await resetPassword(cleanEmail);

      // 2. Resend API Email Dispatch
      await fetch("/api/send-reset-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, actionType: "reset" }),
      });
    } catch (err: unknown) {
      console.warn("Password reset trigger notice:", err);
    }

    // Always display requested confirmation message
    setStatus({
      type: "success",
      message: "You will receive a password reset email if you are a registered user. Please check your inbox and spam folder.",
    });
  };

  const handleClose = () => {
    setStatus({ type: "idle" });
    setEmail("");
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

          {/* Success Banner */}
          {status.type === "success" && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{status.message}</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Banner */}
          {status.type === "error" && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
              {status.message}
            </div>
          )}

          {/* Email Reset Form */}
          {status.type !== "success" && (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    disabled={status.type === "loading"}
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
                  disabled={status.type === "loading"}
                  className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {status.type === "loading" ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
