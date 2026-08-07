"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RegisterFormData } from "@/types/auth";
import { getRoleDashboard } from "./ProtectedRoute";

export const RegisterForm: React.FC = () => {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData | "general", string>>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required for emergency contact.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the Emergency Services Terms.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const profile = await register(formData);
      if (profile) {
        const targetDashboard = getRoleDashboard(profile.role);
        router.push(targetDashboard);
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      let message = "Failed to create account. Please try again.";
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        message = "An account with this email address already exists.";
      } else if (firebaseError.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (firebaseError.code === "auth/api-key-not-valid") {
        message = "Firebase API Key is invalid. Please set valid Firebase credentials in .env.local.";
      } else if (firebaseError.message) {
        message = firebaseError.message;
      }
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setErrors({});

    try {
      const profile = await loginWithGoogle();
      if (profile) {
        const targetDashboard = getRoleDashboard(profile.role);
        router.push(targetDashboard);
      }
    } catch (err: unknown) {
      console.error("Google Registration error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to register with Google.";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-slate-100">
      <div className="text-center mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 font-bold text-2xl mb-3 shadow-lg shadow-red-950">
          🆘
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">Create Citizen Account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Join RescueAI for real-time disaster alerts &amp; emergency coordination
        </p>
      </div>

      {errors.general && (
        <div className="mb-6 rounded-xl bg-red-950/70 border border-red-800 p-3.5 text-xs text-red-300 flex items-center gap-2">
          <span>⚠️</span>
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            disabled={loading}
            className={`w-full px-4 py-2.5 bg-slate-800/80 border ${
              errors.name ? "border-red-500" : "border-slate-700"
            } rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        {/* Grid for Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-slate-800/80 border ${
                errors.email ? "border-red-500" : "border-slate-700"
              } rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 019-2834"
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-slate-800/80 border ${
                errors.phone ? "border-red-500" : "border-slate-700"
              } rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors`}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
          </div>
        </div>

        {/* Grid for Password & Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-slate-800/80 border ${
                errors.password ? "border-red-500" : "border-slate-700"
              } rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-slate-800/80 border ${
                errors.confirmPassword ? "border-red-500" : "border-slate-700"
              } rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors`}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Accept Terms Checkbox */}
        <div>
          <div className="flex items-start">
            <input
              id="accept-terms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-red-500 accent-red-600"
            />
            <label htmlFor="accept-terms" className="ml-2.5 text-xs text-slate-300 leading-normal select-none">
              I accept the Emergency Response Platform Terms of Service and Privacy Policy.
            </label>
          </div>
          {errors.acceptTerms && <p className="mt-1 text-xs text-red-400">{errors.acceptTerms}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Creating Citizen Account...</span>
            </>
          ) : (
            <span>Register Account</span>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs text-slate-500 uppercase font-semibold">Or quick register</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      {/* Google Register */}
      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-3 hover:border-slate-600 disabled:opacity-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3c0 2.9.7 5.6 1.9 8l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
          />
        </svg>
        <span>Register with Google</span>
      </button>

      {/* Login Redirect */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-red-400 hover:text-red-300 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
};
