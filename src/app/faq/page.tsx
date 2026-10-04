"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How can I track the live status of my shipment?",
    a: "Once dispatched, you will receive an SMS and email notification containing your insured courier tracking number. You can also view live status updates within your account dashboard.",
    category: "Orders",
  },
  {
    q: "What raw fibers and materials do you utilize?",
    a: "Our permanent collection exclusively features certified Grade-A Mongolian cashmere, double-faced wool flannel, GOTS-certified Aegean organic cotton, and vegetable-tanned leather from certified Italian tanneries.",
    category: "Craftsmanship",
  },
  {
    q: "How does your complimentary return pickup operate?",
    a: "Every order parcel includes a pre-printed returns label. Simply seal the box and request a doorstep courier pickup via our concierge or hand it to any authorized drop-off center.",
    category: "Returns",
  },
  {
    q: "Are sizes true to international luxury sizing?",
    a: "Yes. Our silhouettes are designed with a contemporary, relaxed luxury drape. For exact measurements, please refer to the Size Guide table available on every product details page.",
    category: "Sizing",
  },
  {
    q: "How do I care for my cashmere and tailored pieces?",
    a: "We recommend dry cleaning for tailored coats and blazers. For pure cashmere knitwear, hand-wash in cool water using neutral wool detergent and dry flat on clean linen.",
    category: "Care",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-stone-50/50 dark:bg-zinc-950 transition-colors min-h-screen py-12 sm:py-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-widest text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900">
            Assistance & Guidance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Find immediate answers regarding orders, sizing, worldwide dispatch, and archival garment care.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. tracking, returns, cashmere)..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 shadow-2xs"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
          {filteredFaqs.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              No matching questions found. Please contact our{" "}
              <Link href="/contact" className="text-blue-600 dark:text-blue-400 underline font-semibold">
                Client Concierge
              </Link>
              .
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.q} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {faq.q}
                    </span>
                    <span
                      className={`text-zinc-400 transform transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    >
                      <ChevronDownIcon size={18} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pt-3 pr-6 animate-fadeIn">
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
