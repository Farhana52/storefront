import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Inspire Lifestyle",
  description: "Our commitment to client confidentiality, data encryption, and privacy rights.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full bg-stone-50/50 dark:bg-zinc-950 transition-colors min-h-screen py-12 sm:py-16 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Legal & Governance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Last updated: October 2026</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-6 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">1. Client Confidentiality</h2>
            <p>
              Inspire Lifestyle regards patron privacy with the utmost deference. We collect only the information necessary
              to process orders, manage deliveries, and provide personalized concierge support.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">2. Data Security & Encryption</h2>
            <p>
              All transactional data and transmission of sensitive credentials are encrypted using bank-grade 256-bit
              TLS protocol. Payment card numbers are never stored on our application servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">3. Third-Party Sharing</h2>
            <p>
              We do not sell, rent, or trade patron profiles or behavioral logs to third-party ad networks or brokers.
              Data is shared strictly with vetted logistics couriers to facilitate order fulfillment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
