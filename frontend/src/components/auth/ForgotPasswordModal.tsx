"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setStatus({ type: "loading" });
    try {
      await resetPassword(email);
      setStatus({
        type: "success",
        message: "Password reset instructions sent! Please check your email inbox.",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset link. Please try again.";
      setStatus({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100">
        <h3 className="text-xl font-bold text-slate-100 mb-2">Reset Password</h3>
        <p className="text-xs text-slate-400 mb-4">
          Enter your registered email address below. We will send you instructions to reset your password.
        </p>

        {status.type === "success" ? (
          <div className="mb-4 rounded-lg bg-emerald-950/60 border border-emerald-800 p-3 text-xs text-emerald-300">
            {status.message}
          </div>
        ) : null}

        {status.type === "error" ? (
          <div className="mb-4 rounded-lg bg-red-950/60 border border-red-800 p-3 text-xs text-red-300">
            {status.message}
          </div>
        ) : null}

        {status.type !== "success" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status.type === "loading"}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {status.type === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}

        {status.type === "success" && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
