"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  ShieldCheck,
  Users,
  AlertCircle,
} from "lucide-react";
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

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
    <div className="w-full max-w-2xl flex flex-col items-center space-y-8 my-6">
      {/* Premium White Floating Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-slate-900/10 border border-gray-100 p-8 sm:p-10 relative z-10"
      >
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-600/30 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            Create <span className="text-red-600">Citizen</span> Account
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2 max-w-md mx-auto">
            Join RescueAI for real-time disaster alerts and emergency coordination.
          </p>
        </div>

        {/* General Error Banner */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700 flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errors.general}</span>
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Full Name (Full Width) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                disabled={loading}
                className={`w-full h-14 pl-12 pr-4 bg-gray-50 border ${
                  errors.name ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200"
                } rounded-2xl text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 font-medium`}
              />
            </div>
            {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.name}</p>}
          </div>

          {/* Row 2: Email & Phone (Two Columns on Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  disabled={loading}
                  className={`w-full h-14 pl-12 pr-4 bg-gray-50 border ${
                    errors.email ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200"
                  } rounded-2xl text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 font-medium`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Emergency Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  disabled={loading}
                  className={`w-full h-14 pl-12 pr-4 bg-gray-50 border ${
                    errors.phone ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200"
                  } rounded-2xl text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 font-medium`}
                />
              </div>
              {errors.phone && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* Row 3: Password & Confirm Password (Two Columns on Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full h-14 pl-12 pr-12 bg-gray-50 border ${
                    errors.password ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200"
                  } rounded-2xl text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 font-medium`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full h-14 pl-12 pr-12 bg-gray-50 border ${
                    errors.confirmPassword ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200"
                  } rounded-2xl text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 font-medium`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Row 4: Accept Terms Checkbox */}
          <div className="pt-1">
            <div className="flex items-start">
              <input
                id="accept-terms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
              />
              <label htmlFor="accept-terms" className="ml-2.5 text-xs font-medium text-gray-600 leading-relaxed select-none cursor-pointer">
                I accept the Emergency Response Platform Terms of Service and Privacy Policy.
              </label>
            </div>
            {errors.acceptTerms && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.acceptTerms}</p>}
          </div>

          {/* Row 5: Register Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 uppercase tracking-wider mt-2"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Creating Citizen Account...</span>
              </>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Row 6: Divider */}
        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
            OR QUICK REGISTER
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Row 7: Google Register Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-2xl shadow-xs font-semibold text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
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

        {/* Row 8: Already Registered Redirect */}
        <p className="mt-8 text-center text-xs text-gray-500 font-medium">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-bold text-red-600 hover:text-red-700 transition-colors inline-flex items-center gap-1 ml-1"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-600" />
          </Link>
        </p>
      </motion.div>

      {/* Security Section: 3 Bottom Responsive Feature Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Card 1: Secure Registration (Red) */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900">Secure Registration</h4>
            <p className="text-[10px] text-gray-500 font-medium">Protected by Firebase Auth</p>
          </div>
        </div>

        {/* Card 2: 24/7 Emergency Support (Blue) */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900">24/7 Emergency Support</h4>
            <p className="text-[10px] text-gray-500 font-medium">Always Ready to Help</p>
          </div>
        </div>

        {/* Card 3: Trusted Platform (Green) */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900">Trusted Platform</h4>
            <p className="text-[10px] text-gray-500 font-medium">Built for Citizens &amp; Rescuers</p>
          </div>
        </div>
      </div>
    </div>
  );
};
