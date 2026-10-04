"use client";

import React, { useEffect, useState } from "react";
import { CloseIcon, UserIcon } from "@/components/ui/icons";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Manage scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setSubmitted(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 1800);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-in-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="w-full max-w-md bg-stone-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white p-1 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
        >
          <CloseIcon size={20} />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-3">
            <UserIcon size={22} />
          </div>
          <h3 id="sign-in-title" className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Welcome to Inspire Lifestyle
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Access exclusive collections, saved pieces, and express checkout.
          </p>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              Magic Link Sent
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Check your inbox at <span className="font-medium text-zinc-700 dark:text-zinc-300">{email}</span> to continue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="modal-email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Email Address
              </label>
              <input
                id="modal-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-medium text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              Continue with Email
            </button>

            <p className="text-[11px] text-center text-zinc-400 dark:text-zinc-500 pt-2">
              Phase 1 Client Prototype &bull; No credentials stored
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
