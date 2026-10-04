"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  MapPin,
  Award,
  Settings,
} from "lucide-react";

interface NavTab {
  href: string;
  matchPrefix: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const PortalNav: React.FC = () => {
  const pathname = usePathname();

  const tabs: NavTab[] = [
    {
      href: "/account/orders",
      matchPrefix: "/account/orders",
      label: "Orders & Deliveries",
      shortLabel: "Orders",
      icon: Package,
    },
    {
      href: "/account/addresses",
      matchPrefix: "/account/addresses",
      label: "Delivery Addresses",
      shortLabel: "Addresses",
      icon: MapPin,
    },
    {
      href: "/account/membership",
      matchPrefix: "/account/membership",
      label: "Membership & Rewards",
      shortLabel: "Rewards",
      icon: Award,
    },
    {
      href: "/account/settings",
      matchPrefix: "/account/settings",
      label: "Settings",
      shortLabel: "Settings",
      icon: Settings,
    },
  ];

  const isTabActive = (tab: NavTab) => {
    if (tab.matchPrefix === "/account/orders") {
      return pathname === "/account" || pathname === "/account/orders" || pathname.startsWith("/account/orders/");
    }
    return pathname.startsWith(tab.matchPrefix);
  };

  return (
    <nav
      aria-label="Customer Portal Navigation"
      className="w-full border-b border-zinc-200/80 dark:border-zinc-800 pb-px"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
        {tabs.map((tab) => {
          const active = isTabActive(tab);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
                active
                  ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono tabular-nums leading-none ${
                    active
                      ? "bg-amber-500 text-zinc-950 font-bold"
                      : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
