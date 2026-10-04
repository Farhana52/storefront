"use client";

import React, { useState, useEffect, useCallback } from "react";
import { OrderCard } from "./order-card";
import { TrackingModal } from "./tracking-modal";
import { InvoiceModal } from "./invoice-modal";
import { CustomerOrder } from "../types";
import { PackageX, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export const OrdersView: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "in_transit" | "delivered">("all");
  const [trackingOrder, setTrackingOrder] = useState<CustomerOrder | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<CustomerOrder | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const email = user?.email || "farhana@inspire.com";
      const phone = user?.phone || "+880 1711-234567";
      const res = await fetch(`/api/orders?customerEmail=${encodeURIComponent(email)}&customerPhone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.orders)) {
          const mapped: CustomerOrder[] = data.orders.map((ord: {
            id: string;
            orderNumber: string;
            createdAt: string;
            orderStatus: string;
            statusLabel?: string;
            totalAmount: number;
            subtotal: number;
            discount: number;
            deliveryFee: number;
            courier: string;
            trackingCode?: string;
            estimatedDelivery?: string;
            shippingAddress: string;
            paymentMethod: string;
            paymentStatus: string;
            timeline?: Array<{ title: string; description: string; timestamp: string; completed: boolean; current?: boolean }>;
            items: Array<{
              id: string;
              title: string;
              price: number;
              quantity: number;
              size?: string;
              color?: string;
              image?: string;
              sku?: string;
            }>;
          }) => ({
            id: ord.id,
            orderNumber: ord.orderNumber,
            date: new Date(ord.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
            status:
              ord.orderStatus === "delivered"
                ? "delivered"
                : ord.orderStatus === "shipped"
                ? "in_transit"
                : ord.orderStatus === "cancelled"
                ? "cancelled"
                : "processing",
            statusLabel: ord.statusLabel || "Processing",
            total: ord.totalAmount,
            subtotal: ord.subtotal,
            discount: ord.discount,
            shippingFee: ord.deliveryFee,
            courier: ord.courier || "Steadfast Express",
            trackingNumber: ord.trackingCode || "TRK-PENDING",
            estimatedDelivery: ord.estimatedDelivery || "Estimated 2-3 business days",
            shippingAddress: ord.shippingAddress,
            paymentMethod: ord.paymentMethod,
            paymentStatus: ord.paymentStatus === "paid" ? "Paid" : "Cash on Delivery",
            items: (ord.items || []).map((it) => ({
              id: it.id,
              name: it.title,
              price: it.price,
              quantity: it.quantity,
              size: it.size || "M",
              color: it.color || "Standard",
              image: it.image || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
              sku: it.sku || `SKU-${it.id.slice(0, 6)}`,
            })),
            trackingSteps: Array.isArray(ord.timeline) ? ord.timeline : [],
          }));
          setOrders(mapped);
        }
      }
    } catch (err) {
      console.error("Failed to load patron orders from Neon PostgreSQL:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const inTransitCount = orders.filter((o) => o.status === "in_transit").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

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
            In transit ({inTransitCount})
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
            Delivered ({deliveredCount})
          </button>
        </div>

        <p className="text-xs text-zinc-500 font-mono">
          <span className="font-semibold text-zinc-900 dark:text-white tabular-nums">{filteredOrders.length}</span> orders
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-zinc-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-mono">Connecting to atelier records...</span>
        </div>
      ) : filteredOrders.length > 0 ? (
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
