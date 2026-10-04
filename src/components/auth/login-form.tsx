"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, CheckIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/auth-context";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
  onSuccessRedirect?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onSwitchToForgot,
  onSuccessRedirect,
}) => {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const val = identifier.trim();

    if (!val) {
      newErrors.identifier = "Email or phone number is required.";
    } else if (val.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        newErrors.identifier = "Please enter a valid email address.";
      }
    } else {
      const phoneDigits = val.replace(/[^0-9]/g, "");
      if (phoneDigits.length < 8 || phoneDigits.length > 15) {
        newErrors.identifier = "Please enter a valid phone number (e.g. 017XXXXXXXX).";
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ identifier: true, password: true });

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const ok = await login(identifier);
      if (ok) {
        setLoginSuccess(true);
        setTimeout(() => {
          if (onSuccessRedirect) {
            onSuccessRedirect();
          } else {
            router.push("/");
          }
        }, 800);
      } else {
        setErrors({ identifier: "Unable to sign in. Please check credentials." });
      }
    } catch {
      setErrors({ identifier: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Refined Header */}
      <div className="text-center pb-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Sign In
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Welcome back to Inspire Lifestyle
        </p>
      </div>

      {/* Success Notification */}
      {loginSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckIcon size={14} className="text-emerald-600 shrink-0" />
          <span>Signed in successfully! Synchronizing your bag & wishlist...</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-identifier"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Email or Phone Number
          </label>
          <input
            id="login-identifier"
            type="text"
            autoComplete="username"
            placeholder="name@example.com or 017XXXXXXXX"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: "" }));
            }}
            onBlur={() => handleBlur("identifier")}
            style={{ outline: "none", boxShadow: "none" }}
            className={`w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl border bg-zinc-50/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-900 !outline-none !ring-0 transition-colors ${
              touched.identifier && errors.identifier
                ? "border-rose-400 focus:border-rose-500"
                : "border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100"
            }`}
          />
          {touched.identifier && errors.identifier && (
            <p className="text-[11px] font-medium text-rose-500 mt-0.5">{errors.identifier}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <button
              type="button"
              onClick={onSwitchToForgot}
              className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              onBlur={() => handleBlur("password")}
              style={{ outline: "none", boxShadow: "none" }}
              className={`w-full h-11 px-3.5 pr-10 text-xs sm:text-sm rounded-xl border bg-zinc-50/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-900 !outline-none !ring-0 transition-colors ${
                touched.password && errors.password
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
            >
              {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="text-[11px] font-medium text-rose-500 mt-0.5">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 px-4 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all shadow-xs cursor-pointer flex items-center justify-center mt-3"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-zinc-950 dark:text-white hover:underline cursor-pointer ml-1"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};
