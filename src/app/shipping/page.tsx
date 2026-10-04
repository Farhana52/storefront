import React from "react";
import { Metadata } from "next";
import { TruckIcon, ShieldCheckIcon, CheckIcon } from "@/components/ui/icons";
import { DeliveryTierSelector } from "@/components/shipping/delivery-tier-selector";
import { ReturnRequestButton } from "@/components/shipping/return-request-modal";

export const metadata: Metadata = {
  title: "Shipping & Returns — Inspire Lifestyle",
  description: "Express courier delivery, complimentary returns, and white-glove concierge options.",
};

export default function ShippingPage() {
  return (
    <div className="w-full bg-stone-50/50 dark:bg-zinc-950 transition-colors min-h-screen py-10 sm:py-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header: Clean title only without clutter */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Shipping, Delivery & Returns
          </h1>
        </div>

        {/* Shipping Options Table/Cards */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <TruckIcon size={18} className="text-zinc-900 dark:text-white" />
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                Delivery Tiers & Timeframes
              </h2>
            </div>

            {/* Interactive Selectable Delivery Tiers */}
            <DeliveryTierSelector />
          </section>

          {/* Returns & Exchanges Policy */}
          <section id="returns" className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <ShieldCheckIcon size={18} className="text-emerald-500" />
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                Effortless 30-Day Returns
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We offer complimentary doorstep return pickups within 30 days of delivery.
              Garments must be unworn, unwashed, and returned in their original archival packaging with security tags intact.
            </p>

            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2">
              <div className="flex items-center gap-2">
                <CheckIcon size={14} className="text-emerald-500" />
                <span>Pre-paid return shipping label enclosed in every delivery parcel.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon size={14} className="text-emerald-500" />
                <span>Full refunds credited to original payment method within 3 business days of receipt.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon size={14} className="text-emerald-500" />
                <span>Instant size exchanges dispatched free of charge.</span>
              </div>
            </div>

            <div className="pt-2">
              <ReturnRequestButton />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
