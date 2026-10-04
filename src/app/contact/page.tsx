"use client";

import React, { useState } from "react";
import { CheckIcon, PhoneIcon, MailIcon, MapPinIcon } from "@/components/ui/icons";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-stone-50/50 dark:bg-zinc-950 transition-colors min-h-screen py-8 sm:py-12 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Header: Proportionate, refined title */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Get in Touch With Us
          </h1>
        </div>

        {/* Direct Contact Cards (Slim, elegant, and perfectly sized with the page) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <a
            href="tel:+8801800000000"
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white shrink-0 group-hover:scale-105 transition-transform">
              <PhoneIcon size={14} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              +880 1800-000000
            </span>
          </a>

          <a
            href="mailto:support@inspirelifestyle.com"
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white shrink-0 group-hover:scale-105 transition-transform">
              <MailIcon size={14} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              support@inspirelifestyle.com
            </span>
          </a>

          <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white shrink-0">
              <MapPinIcon size={14} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              Gulshan-2, Dhaka
            </span>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckIcon size={28} />
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white">
                Message Sent Successfully
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Thank you, {name}. A dedicated client advisor will review your note and respond to{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{email}</span> within 4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julianne Laurent"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. julianne@domain.com"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>


              <div className="space-y-1.5">
                <label htmlFor="contact-msg" className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How may our advisors assist you today?"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity shadow-md cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
