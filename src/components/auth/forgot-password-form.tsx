"use client";

import React, { useState } from "react";
import { CheckIcon, ArrowRightIcon, LockIcon } from "@/components/ui/icons";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Please provide a valid email format.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate password reset request dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setResendCooldown(30);
    }, 1000);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setResendCooldown(30);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {submitted ? (
        /* Confirmation Screen */
        <div className="space-y-6 text-center animate-fadeIn py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckIcon size={28} />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Password Reset Link Dispatched
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
              We have transmitted an encrypted reset link to{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">{email}</span>.
              Please check your inbox (and spam folder) within the next 15 minutes.
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isSubmitting}
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {resendCooldown > 0
                ? `Didn't receive email? Resend in ${resendCooldown}s`
                : "Didn't receive email? Click to resend"}
            </button>

            <div>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="w-full py-3.5 px-6 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md cursor-pointer"
              >
                <span>Return to Sign In</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Request Reset Form */
        <>
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <LockIcon size={20} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Reset Your Password
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Enter your verified email address and we&apos;ll dispatch an authorization link to reset
              your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="forgot-email"
                className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
              >
                Account Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="e.g. patron@inspirelifestyle.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all focus:outline-none focus:ring-2 ${
                  error
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                    : "border-zinc-300 dark:border-zinc-700 focus:border-blue-600 focus:ring-blue-100"
                }`}
              />
              {error && <p className="text-[11px] font-medium text-rose-500 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.99] cursor-pointer mt-4"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Dispatching Reset Link...</span>
                </div>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Back to Sign In Link */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              &larr; Back to Sign In
            </button>
          </div>
        </>
      )}
    </div>
  );
};
