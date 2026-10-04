"use client";

import React from "react";
import {
  CreditCard,
  Users,
  ShoppingBag,
  Activity,
  TrendingUp,
} from "lucide-react";

export const KPICardsGrid: React.FC = () => {
  const cards = [
    {
      title: "Total revenue",
      value: "৳2,845,900",
      trend: "+20.1%",
      description: "from last month",
      icon: CreditCard,
    },
    {
      title: "Active customers",
      value: "942",
      trend: "+18.2%",
      description: "registered customers",
      icon: Users,
    },
    {
      title: "Sales volume",
      value: "1,284",
      trend: "+12.4%",
      description: "orders fulfilled",
      icon: ShoppingBag,
    },
    {
      title: "Fulfillment rate",
      value: "99.2%",
      trend: "+1.2%",
      description: "on-time delivery",
      icon: Activity,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {card.title}
              </span>
              <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            </div>

            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tracking-tight tabular-nums">
              {card.value}
            </div>

            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-0.5 font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                {card.trend}
              </span>
              <span>{card.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
