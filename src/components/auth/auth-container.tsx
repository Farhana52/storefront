"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthMode } from "@/types";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

interface AuthContainerProps {
  initialMode?: AuthMode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  return (
    <div className="min-h-[calc(100vh-140px)] w-full pt-6 sm:pt-14 pb-14 px-4 flex flex-col items-center justify-start sm:justify-center bg-stone-50/40 dark:bg-zinc-950 transition-colors">
      {/* Centered Minimal Auth Box */}
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
        {/* Active Form */}
        <div>
          {mode === "login" && (
            <LoginForm
              onSwitchToRegister={() => setMode("register")}
              onSwitchToForgot={() => setMode("forgot")}
            />
          )}

          {mode === "register" && (
            <RegisterForm onSwitchToLogin={() => setMode("login")} />
          )}

          {mode === "forgot" && (
            <ForgotPasswordForm onSwitchToLogin={() => setMode("login")} />
          )}
        </div>
      </div>

      {/* Return to Store Link */}
      <div className="mt-5 text-center">
        <Link
          href="/"
          className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          &larr; Return to Store
        </Link>
      </div>
    </div>
  );
};
