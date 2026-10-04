import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Inspire Lifestyle",
  description: "Terms governing orders, authentication, delivery, and services at Inspire Lifestyle.",
};

export default function TermsPage() {
  return (
    <div className="w-full bg-stone-50/50 dark:bg-zinc-950 transition-colors min-h-screen py-12 sm:py-16 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Legal & Governance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white mt-1">
            Terms of Service
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Last updated: October 2026</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-6 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">1. Orders & Authorization</h2>
            <p>
              By placing an order through Inspire Lifestyle, patrons agree to provide accurate recipient and payment details.
              Orders remain subject to product availability and authorization validation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">2. Pricing & Currency</h2>
            <p>
              All prices shown are quoted in Bangladeshi Taka (৳ BDT). Applicable delivery fees and item totals
              are clearly itemized during checkout.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">3. Intellectual Property</h2>
            <p>
              All designs, lookbooks, editorial imagery, and brand marks are exclusive intellectual
              property of Inspire Lifestyle and protected under international copyright law.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
