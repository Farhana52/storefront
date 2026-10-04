"use client";

import React, { useState } from "react";
import { OrderCard } from "./order-card";
import { TrackingModal } from "./tracking-modal";
import { InvoiceModal } from "./invoice-modal";
import { DEFAULT_PATRON_ORDERS } from "../mock-data";
import { CustomerOrder } from "../types";
import { PackageX } from "lucide-react";

export const OrdersView: React.FC = () => {
  const [orders] = useState<CustomerOrder[]>(DEFAULT_PATRON_ORDERS);
  const [filter, setFilter] = useState<"all" | "in_transit" | "delivered">("all");
  const [trackingOrder, setTrackingOrder] = useState<CustomerOrder | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<CustomerOrder | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (filter === "in_transit") return order.status === "in_transit";
    if (filter === "delivered") return order.status === "delivered";
    return true;
  });

  return (
    <section aria-label="Patron Orders Workspace" className="space-y-6">
      {/* Filter and Count Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter orders by fulfillment status"
          className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
        >
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            All ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("in_transit")}
            className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filter === "in_transit"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            In transit (1)
          </button>

          <button
            type="button"
            onClick={() => setFilter("delivered")}
            className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filter === "delivered"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Delivered (1)
          </button>
        </div>

        <p className="text-xs text-zinc-500 font-mono">
          <span className="font-semibold text-zinc-900 dark:text-white tabular-nums">{filteredOrders.length}</span> orders
        </p>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onTrack={setTrackingOrder}
              onInvoice={setInvoiceOrder}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
            <PackageX className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            No orders found
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            No orders match the selected filter.
          </p>
        </div>
      )}

      {/* Modals */}
      <TrackingModal
        order={trackingOrder}
        open={!!trackingOrder}
        onOpenChange={(open) => !open && setTrackingOrder(null)}
      />

      <InvoiceModal
        order={invoiceOrder}
        open={!!invoiceOrder}
        onOpenChange={(open) => !open && setInvoiceOrder(null)}
      />
    </section>
  );
};
