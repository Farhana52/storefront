"use client";

import React from "react";
import Image from "next/image";
import { AdminOrder } from "@/data/admin-data";

interface RecentSalesProps {
  orders: AdminOrder[];
  onSelectOrder?: (order: AdminOrder) => void;
}

export const RecentSales: React.FC<RecentSalesProps> = ({
  orders,
  onSelectOrder,
}) => {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent sales
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {orders.length} orders recorded across channels
          </p>
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
          Live
        </span>
      </div>

      {/* Rows */}
      <div className="space-y-3.5 pt-4">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order.id}
            onClick={() => onSelectOrder?.(order)}
            className="flex items-center justify-between gap-3 p-1.5 -mx-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/60 dark:border-zinc-800">
                <Image
                  src={order.customer.avatar}
                  alt={order.customer.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white truncate">
                    {order.customer.name}
                  </p>
                  <span className="text-[9px] font-medium text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1 rounded">
                    {order.customer.tier}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {order.shippingCity} • {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                +৳{order.totalAmount.toLocaleString()}
              </div>
              <span className="text-[10px] text-zinc-400 uppercase font-mono">
                {order.paymentMethod}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
