"use client";

import React, { useState } from "react";

interface ShippingOption {
  id: string;
  name: string;
  price: string;
  description: string;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "ground",
    name: "Ground Delivery",
    price: "৳80.00",
    description: "2–3 Business Days. Complimentary on orders over ৳2,500.",
  },
  {
    id: "express",
    name: "Express Courier",
    price: "৳150.00",
    description: "24–48 Hours. Priority courier dispatch across Bangladesh.",
  },
  {
    id: "concierge",
    name: "White Glove Concierge",
    price: "৳250.00",
    description: "Same-Day Guaranteed. Hand-delivered in protective garment cases.",
  },
];

export const DeliveryTierSelector: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("express");

  return (
    <div
      role="radiogroup"
      aria-label="Delivery tiers"
      className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4"
    >
      {SHIPPING_OPTIONS.map((option) => {
        const isSelected = selectedId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setSelectedId(option.id)}
            className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative active:scale-[0.98] ${
              isSelected
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md ring-2 ring-zinc-950 dark:ring-white border-transparent"
                : "bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? "text-zinc-300 dark:text-zinc-600"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {option.name}
                </span>

                {/* Radio selection indicator */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "border-white bg-white text-zinc-950 dark:border-zinc-950 dark:bg-zinc-950 dark:text-white"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>
              </div>

              <p className="text-xl font-extrabold mt-1.5 tracking-tight">
                {option.price}
              </p>
            </div>

            <p
              className={`text-xs leading-relaxed ${
                isSelected
                  ? "text-zinc-300 dark:text-zinc-600"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};
