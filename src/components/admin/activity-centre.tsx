"use client";

import React, { useState } from "react";
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PackageIcon,
  UsersIcon,
  ChevronDownIcon,
} from "@/components/ui/icons";

export interface ActivityItem {
  id: string;
  type: "order" | "payment" | "alert" | "courier" | "review";
  title: string;
  meta: string;
  time: string;
  actionText?: string;
  onAction?: () => void;
}

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "order",
    title: "New order #ORD-9281",
    meta: "Tahmid Rahman • Banani, Dhaka (৳5,600)",
    time: "12m ago",
    actionText: "View order",
  },
  {
    id: "act-2",
    type: "payment",
    title: "bKash verified #BK-9X4810294",
    meta: "৳5,600 settled into merchant account",
    time: "14m ago",
  },
  {
    id: "act-3",
    type: "alert",
    title: "Low stock alert",
    meta: "Virgin Wool Blazer (Obsidian, Size L) — 2 units left",
    time: "48m ago",
    actionText: "Restock",
  },
  {
    id: "act-4",
    type: "courier",
    title: "Steadfast dispatched",
    meta: "Package #ORD-9280 handed over to Chittagong Hub",
    time: "2h ago",
  },
  {
    id: "act-5",
    type: "review",
    title: "Customer review received",
    meta: "Dr. Sabrina: 'Signature cedarwood packaging was breathtaking.'",
    time: "4h ago",
  },
];

interface ActivityCentreProps {
  onInspectOrder?: (orderId: string) => void;
}

export const ActivityCentre: React.FC<ActivityCentreProps> = ({
  onInspectOrder,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<"today" | "week">("today");

  const getItemIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "order":
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShoppingBagIcon size={15} />
          </div>
        );
      case "payment":
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircleIcon size={15} />
          </div>
        );
      case "alert":
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircleIcon size={15} />
          </div>
        );
      case "courier":
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <PackageIcon size={15} />
          </div>
        );
      case "review":
        return (
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <UsersIcon size={15} />
          </div>
        );
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200/70 dark:border-zinc-800/70">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              Recent activity
            </h3>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              Live events across orders, payments, and delivery
            </p>
          </div>

          <div className="relative">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as "today" | "week")}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 cursor-pointer focus:outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This week</option>
            </select>
            <ChevronDownIcon
              size={11}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Activity List */}
        <div className="mt-3.5 space-y-2.5">
          {INITIAL_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-start gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              {getItemIcon(act.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate">
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono shrink-0">
                    {act.time}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                  {act.meta}
                </p>

                {act.actionText && (
                  <button
                    type="button"
                    onClick={() => {
                      if (act.id === "act-1" && onInspectOrder) {
                        onInspectOrder("ORD-9281");
                      }
                    }}
                    className="mt-1 text-[11px] font-bold text-zinc-900 dark:text-white hover:underline cursor-pointer"
                  >
                    {act.actionText} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 mt-3 border-t border-zinc-200/70 dark:border-zinc-800/70 text-center">
        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          Showing 5 latest events
        </span>
      </div>
    </div>
  );
};
