"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  ShieldCheck,
  Users,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormData } from "@/types/auth";
import { getRoleDashboard } from "./ProtectedRoute";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

export const LoginForm: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
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
      const profile = await login(formData);
      if (profile) {
        const targetDashboard = getRoleDashboard(profile.role);
        router.push(targetDashboard);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      let message = "Invalid email or password. Please check your credentials.";
      const firebaseError = err as { code?: string; message?: string };
      
      if (firebaseError.code === "auth/admin-password-mismatch" || firebaseError.message?.includes("Authorized")) {
        message = firebaseError.message || "Authorized Admin account detected. Please check your assigned temporary password or click 'Forgot password?' below.";
      } else if (firebaseError.code === "auth/invalid-credential" || firebaseError.code === "auth/wrong-password") {
        message = "Incorrect password. If you forgot your password, please click 'Forgot password?' to receive a reset link in your email.";
      } else if (firebaseError.code === "auth/user-not-found") {
        message = "No account found with this email address. Click 'Register as Citizen' below to create your account.";
      } else if (firebaseError.message) {
        message = firebaseError.message;
      }
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrors({});

    try {
      const profile = await loginWithGoogle();
      if (profile) {
        const targetDashboard = getRoleDashboard(profile.role);
        router.push(targetDashboard);
      }
    } catch (err: unknown) {
      console.error("Google Auth error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to authenticate with Google.";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col items-center space-y-8 my-6">
      {/* Floating Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-slate-900/10 border border-gray-100 p-8 sm:p-12 relative z-10"
      >
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-600/30 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            Welcome <span className="text-red-600">Back</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2 max-w-sm mx-auto">
            Access the RescueAI Emergency Coordination Command Center
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
            <div className="space-y-1">
              <p className="leading-relaxed">{errors.general}</p>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-red-600 underline font-bold hover:text-red-800 transition-colors flex items-center gap-1 mt-1 text-[11px]"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Click here to send Password Reset Link to your email</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input Field */}
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
                placeholder="citizen@rescueai.org"
                disabled={loading}
                className={`w-full h-14 pl-12 pr-4 bg-white border ${
                  errors.email ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-200"
                } rounded-2xl text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 font-medium`}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.email}</p>}
          </div>

          {/* Password Input Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>
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
                className={`w-full h-14 pl-12 pr-12 bg-white border ${
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center pt-1">
            <input
              id="remember-me"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2.5 text-xs font-medium text-gray-600 select-none cursor-pointer">
              Remember my session on this device
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 uppercase tracking-wider mt-2"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to RescueAI</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
            OR CONTINUE WITH
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google Sign-in Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
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
          <span>Sign in with Google</span>
        </button>

        {/* Register Redirect Link */}
        <p className="mt-8 text-center text-xs text-gray-500 font-medium">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-bold text-red-600 hover:text-red-700 transition-colors inline-flex items-center gap-1 ml-1"
          >
            <span>Register as Citizen</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-600" />
          </Link>
        </p>
      </motion.div>

      {/* 3 Responsive Bottom Feature Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Card 1: Secure Access */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900">Secure Access</h4>
            <p className="text-[10px] text-gray-500 font-medium">End-to-End Encryption</p>
          </div>
        </div>

        {/* Card 2: 24/7 Protection */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900">24/7 Protection</h4>
            <p className="text-[10px] text-gray-500 font-medium">Always Here To Help</p>
          </div>
        </div>

        {/* Card 3: Trusted by Thousands */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900">Trusted by Thousands</h4>
            <p className="text-[10px] text-gray-500 font-medium">Across the Nation</p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
    </div>
  );
};
