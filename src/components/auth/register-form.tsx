"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, CheckIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/auth-context";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccessRedirect?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  onSuccessRedirect,
}) => {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Dynamic Password Strength Calculator
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "Empty", color: "bg-zinc-200" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 100, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 15, label: "Very Weak", color: "bg-rose-400" };
    }
  }, [password]);

  // Field validation logic
  const validate = () => {
    const newErrors: Record<string, string> = {};
    const val = identifier.trim();

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Please enter your full name.";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "You must accept the terms of service.";
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
    setTouched({
      fullName: true,
      identifier: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const ok = await register(fullName, identifier);
      if (ok) {
        setRegisterSuccess(true);
        setTimeout(() => {
          if (onSuccessRedirect) {
            onSuccessRedirect();
          } else {
            router.push("/");
          }
        }, 900);
      } else {
        setErrors({ identifier: "Registration failed. Please try again." });
      }
    } catch {
      setErrors({ identifier: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Create an Inspire Lifestyle Account
        </h2>
      </div>

      {/* Success Notification */}
      {registerSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
            <CheckIcon size={14} />
          </div>
          <div>
            <p className="font-semibold text-sm">Account created successfully!</p>
            <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
              Welcome to Inspire Lifestyle. Synchronizing your bag & favorites...
            </p>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-fullname"
            className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Full Name
          </label>
          <input
            id="register-fullname"
            type="text"
            autoComplete="name"
            placeholder="e.g. Farhana Nasrin"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
            }}
            onBlur={() => handleBlur("fullName")}
            className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all focus:outline-none focus:ring-1 ${
              touched.fullName && errors.fullName
                ? "border-rose-400 focus:border-rose-500"
                : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100"
            }`}
          />
          {touched.fullName && errors.fullName && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email Address or Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-identifier"
            className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Email or Phone Number
          </label>
          <input
            id="register-identifier"
            type="text"
            autoComplete="username"
            placeholder="name@example.com or 017XXXXXXXX"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: "" }));
            }}
            onBlur={() => handleBlur("identifier")}
            className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all focus:outline-none focus:ring-1 ${
              touched.identifier && errors.identifier
                ? "border-rose-400 focus:border-rose-500"
                : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100"
            }`}
          />
          {touched.identifier && errors.identifier && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.identifier}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-password"
            className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              onBlur={() => handleBlur("password")}
              className={`w-full px-4 py-2.5 pr-10 text-xs sm:text-sm rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all focus:outline-none focus:ring-1 ${
                touched.password && errors.password
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
            >
              {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>

          {/* Password Strength Indicator Bar */}
          {password.length > 0 && (
            <div className="pt-1 space-y-1">
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                <span>Strength:</span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          )}

          {touched.password && errors.password && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-confirm-password"
            className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              onBlur={() => handleBlur("confirmPassword")}
              className={`w-full px-4 py-2.5 pr-10 text-xs sm:text-sm rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all focus:outline-none focus:ring-1 ${
                touched.confirmPassword && errors.confirmPassword
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
            >
              {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms of Service Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-950 focus:ring-0 cursor-pointer"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-zinc-950 dark:text-white font-medium hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-zinc-950 dark:text-white font-medium hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs sm:text-sm tracking-wide uppercase hover:opacity-90 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
        >
          {isSubmitting ? "Creating Patron Account..." : "Create Account"}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-zinc-950 dark:text-white hover:underline cursor-pointer ml-1"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
