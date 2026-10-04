"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileText, Navigation, CheckCircle2, Clock } from "lucide-react";
import { CustomerOrder } from "../types";

interface OrderCardProps {
  order: CustomerOrder;
  onTrack: (order: CustomerOrder) => void;
  onInvoice: (order: CustomerOrder) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onTrack,
  onInvoice,
}) => {
  const isInTransit = order.status === "in_transit";
  const isDelivered = order.status === "delivered";

  return (
    <article
      aria-labelledby={`order-heading-${order.id}`}
      className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
    >
      {/* Order Header Ribbon */}
      <header className="p-4 sm:px-5 sm:py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2
            id={`order-heading-${order.id}`}
            className="text-xs sm:text-sm font-bold font-mono tracking-tight text-zinc-950 dark:text-white"
          >
            Order #{order.orderNumber}
          </h2>
          <span className="text-zinc-400 dark:text-zinc-600 font-mono text-xs" aria-hidden="true">
            ·
          </span>
          <span className="text-xs text-zinc-500 font-mono tabular-nums">
            {order.date}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wide ${
              isInTransit
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                : isDelivered
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {isInTransit ? (
              <Clock className="w-3 h-3" />
            ) : (
              <CheckCircle2 className="w-3 h-3" />
            )}
            {order.statusLabel}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onInvoice(order)}
            className="flex-1 sm:flex-none h-9 sm:h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
            aria-label={`View invoice for order ${order.orderNumber}`}
          >
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            <span>Invoice</span>
          </Button>

          <Button
            size="sm"
            onClick={() => onTrack(order)}
            className="flex-1 sm:flex-none h-9 sm:h-8 px-3 text-xs gap-1.5 cursor-pointer bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            aria-label={`Track delivery for order ${order.orderNumber}`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Track</span>
          </Button>
        </div>
      </header>

      {/* Order Body: Products & Logistics Details */}
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Products List (2 cols) */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-zinc-400 font-mono">
            Pieces ({order.items.length})
          </p>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/60 dark:border-zinc-800 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
                    {item.size} · {item.color} · Qty: <span className="tabular-nums font-semibold">{item.quantity}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs sm:text-sm font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                    ৳{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logistics & Delivery Summary (1 col) */}
        <div className="lg:border-l lg:border-zinc-100 dark:lg:border-zinc-800 lg:pl-6 grid grid-cols-2 lg:block gap-3 lg:space-y-3.5 text-xs font-mono pt-3 lg:pt-0 border-t border-zinc-100 dark:border-zinc-800 lg:border-t-0">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
              Logistics
            </span>
            <p className="text-zinc-900 dark:text-zinc-200 font-semibold">{order.courier}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
              Tracking
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 select-all truncate">{order.trackingNumber}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
              Payment
            </span>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{order.paymentStatus}</p>
          </div>

          <div className="col-span-2 lg:col-span-1 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-baseline">
              <span className="text-zinc-500 font-sans text-xs">Total:</span>
              <span className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white tabular-nums">
                ৳{order.total.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 font-sans">
              {order.estimatedDelivery}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
