"use client";

import React, { useState } from "react";

interface SocialAuthButtonsProps {
  labelPrefix?: "Sign in" | "Sign up";
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  labelPrefix = "Sign in",
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSocialClick = (provider: string) => {
    setToastMessage(`Authenticating with ${provider}... (Phase 2 OAuth Ready)`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div className="space-y-3">
      {/* Toast Notification for Mock Social Click */}
      {toastMessage && (
        <div className="p-3 text-xs rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-medium flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-blue-500 hover:text-blue-700 text-xs font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => handleSocialClick("Google")}
          className="w-full py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
        >
          {/* Authentic Google Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.94H1.26v3.15C3.25 21.36 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.32 14.26c-.24-.72-.38-1.49-.38-2.26s.14-1.54.38-2.26V6.59H1.26A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.26 5.41l4.06-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.59l4.06 3.15c.94-2.84 3.58-4.97 6.68-4.97z"
            />
          </svg>
          <span>{labelPrefix} with Google</span>
        </button>

        {/* Apple OAuth Button */}
        <button
          type="button"
          onClick={() => handleSocialClick("Apple")}
          className="w-full py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
        >
          {/* Authentic Apple Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.08 1.73-.95 2.76 1.01.08 2.06-.51 2.68-1.26z" />
          </svg>
          <span>{labelPrefix} with Apple</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative px-3 bg-white dark:bg-zinc-900 text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
          or
        </div>
      </div>
    </div>
  );
};
