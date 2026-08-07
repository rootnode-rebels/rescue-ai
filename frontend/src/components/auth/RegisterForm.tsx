"use client";

import React, { useState } from "react";
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
  ShieldCheck,
  AlertCircle,
  Building2,
  BadgeCheck,
  Ambulance,
  Building,
  HeartHandshake,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RegisterFormData, UserRole } from "@/types/auth";
import { getRoleDashboard } from "./ProtectedRoute";

export const RegisterForm: React.FC = () => {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [regMode, setRegMode] = useState<"citizen" | "official">("citizen");
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
    organization: "",
    badgeNumber: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData | "general", string>>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);

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

    if (regMode === "official") {
      if (!formData.organization?.trim()) {
        newErrors.organization = "Organization / Battalion name is required for official roles.";
      }
      if (!formData.badgeNumber?.trim()) {
        newErrors.badgeNumber = "Official Badge / ID Number is required for verification.";
      }
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
    setPendingNotice(null);

    try {
      const profile = await register(formData);
      if (profile) {
        if (regMode === "official") {
          setPendingNotice(
            `Official application for "${formData.name}" (${formData.role.toUpperCase()}) submitted successfully! Your account is in "Pending Super Admin Approval" queue.`
          );
        } else {
          const targetDashboard = getRoleDashboard(profile.role);
          router.push(targetDashboard);
        }
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      let message = "Failed to create account. Please try again.";
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        message = "An account with this email address already exists.";
      } else if (firebaseError.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
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
      const profile = await loginWithGoogle(regMode === "official" ? formData.role : "citizen");
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
    <div className="w-full max-w-xl flex flex-col items-center space-y-6 my-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-slate-900/10 border border-gray-100 p-8 sm:p-10 relative z-10"
      >
        {/* Card Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-600/30 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            Account <span className="text-red-600">Registration</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2 max-w-md mx-auto">
            Create a Citizen Account or submit an Official Responder Application.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-gray-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setRegMode("citizen");
              setFormData((prev) => ({ ...prev, role: "citizen" }));
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              regMode === "citizen"
                ? "bg-red-600 text-white shadow-md shadow-red-950"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Citizen Account
          </button>
          <button
            type="button"
            onClick={() => {
              setRegMode("official");
              setFormData((prev) => ({ ...prev, role: "rescue" }));
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              regMode === "official"
                ? "bg-red-600 text-white shadow-md shadow-red-950"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Official Agency / Volunteer
          </button>
        </div>

        {/* Official Pending Application Alert */}
        {pendingNotice && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-semibold flex items-start gap-3 shadow-xs">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>{pendingNotice}</span>
          </div>
        )}

        {/* Super Admin Review Note for Official Mode */}
        {regMode === "official" && !pendingNotice && (
          <div className="mb-6 p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Super Admin Approval Required:</strong> Official Responder accounts (Rescue Teams, Volunteers, Hospitals, NGOs) require authorization by a Super Admin before full access is granted.
            </p>
          </div>
        )}

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

        {/* Official Role Selector for Official Mode */}
        {regMode === "official" && (
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Select Official Role Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "rescue", title: "Rescue Team", icon: Ambulance },
                { id: "authority", title: "Authority / EOC", icon: ShieldCheck },
                { id: "hospital", title: "Hospital Triage", icon: Building },
                { id: "ngo", title: "NGO / Relief", icon: HeartHandshake },
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = formData.role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: item.id as UserRole })}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? "border-red-600 bg-red-50 text-red-900 font-extrabold ring-2 ring-red-500/30"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComp className={`w-5 h-5 mb-1 ${isSelected ? "text-red-600" : "text-gray-500"}`} />
                    <span className="text-xs">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={regMode === "official" ? "Commander Sarah Jenkins" : "John Doe"}
                disabled={loading}
                className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-red-500 font-medium"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs font-semibold text-red-500">{errors.name}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="responder@rescueai.gov"
                  disabled={loading}
                  className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-red-500 font-medium"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs font-semibold text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Emergency Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  disabled={loading}
                  className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-red-500 font-medium"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs font-semibold text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* Conditional Official Fields */}
          {regMode === "official" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organization / Unit</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="NDRF Fire Battalion 4"
                    disabled={loading}
                    className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>
                {errors.organization && (
                  <p className="mt-1 text-xs font-semibold text-red-500">{errors.organization}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Official Badge / ID</label>
                <div className="relative">
                  <BadgeCheck className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                  <input
                    type="text"
                    value={formData.badgeNumber}
                    onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                    placeholder="BADGE-NDRF-9081"
                    disabled={loading}
                    className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>
                {errors.badgeNumber && (
                  <p className="mt-1 text-xs font-semibold text-red-500">{errors.badgeNumber}</p>
                )}
              </div>
            </div>
          )}

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full h-12 pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-red-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs font-semibold text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full h-12 pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-red-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs font-semibold text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Accept Terms Checkbox */}
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
            {errors.acceptTerms && <p className="mt-1 text-xs font-semibold text-red-500">{errors.acceptTerms}</p>}
          </div>

          {/* Register Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-13 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 uppercase tracking-wider mt-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>
                  {regMode === "official"
                    ? `Submit ${formData.role.toUpperCase()} Application for Approval`
                    : "Register Citizen Account"}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
            OR QUICK REGISTER
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google Register Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-2xl shadow-xs font-semibold text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
      </motion.div>
    </div>
  );
};
