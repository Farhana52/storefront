"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCMS } from "@/context/cms-context";
import { AdminOrderStatus } from "@/data/admin-data";
import {
  ArrowLeft,
  Printer,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = params ? use(params) : null;
  const clientParams = useParams();
  const orderId = resolvedParams?.id || (clientParams?.id as string) || "";

  const { orders, updateOrderStatus } = useCMS();

  const order = orders.find(
    (o) => o.id === orderId || o.id === `ORD-${orderId}`
  );

  const [currentStatus, setCurrentStatus] = useState<AdminOrderStatus>(
    order?.orderStatus || "pending"
  );

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Order Not Found
        </h2>
        <p className="text-sm text-zinc-500">
          The requested order (ID: {orderId}) does not exist.
        </p>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: AdminOrderStatus) => {
    setCurrentStatus(newStatus);
    updateOrderStatus(order.id, newStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: AdminOrderStatus) => {
    switch (status) {
      case "delivered":
        return { variant: "success" as const, label: "Delivered" };
      case "shipped":
        return { variant: "secondary" as const, label: "Shipped & In Transit" };
      case "processing":
        return { variant: "default" as const, label: "Processing & Packaging" };
      case "pending":
        return { variant: "warning" as const, label: "Pending Verification" };
      case "cancelled":
        return { variant: "destructive" as const, label: "Cancelled" };
    }
  };

  const badge = getStatusBadge(currentStatus);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono tabular-nums">
              {order.id}
            </h1>
            <Badge variant={badge.variant} className="capitalize text-xs">
              {badge.label}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Recorded on {order.createdAt} • Courier: {order.courier}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">Status:</span>
            <select
              value={currentStatus}
              onChange={(e) =>
                handleStatusChange(e.target.value as AdminOrderStatus)
              }
              className="h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer shadow-2xs"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print invoice</span>
          </Button>
        </div>
      </div>

      {/* Fulfillment Progress Stepper Bar */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xs print:hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              step: "1. Order Received",
              date: order.createdAt,
              done: true,
              active: currentStatus === "pending",
            },
            {
              step: "2. Payment Verified",
              date: order.paymentStatus === "paid" ? "Confirmed" : "Pending",
              done:
                order.paymentStatus === "paid" ||
                currentStatus !== "pending",
              active: currentStatus === "processing",
            },
            {
              step: "3. Dispatched / Courier",
              date: order.trackingCode || "In Transit",
              done:
                currentStatus === "shipped" || currentStatus === "delivered",
              active: currentStatus === "shipped",
            },
            {
              step: "4. Delivered to Patron",
              date:
                currentStatus === "delivered"
                  ? "Completed"
                  : order.estimatedDelivery || "Expected soon",
              done: currentStatus === "delivered",
              active: currentStatus === "delivered",
            },
          ].map((s, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                  s.done
                    ? "bg-emerald-600 text-white"
                    : s.active
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 animate-pulse"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}
              >
                {s.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {s.step}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  {s.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Order & Invoice Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Line Items & Customer Information (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Information Card */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Customer & Delivery Profile
                </h3>
              </div>
              <Link
                href={`/admin/customers/${order.customer.id}`}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>View 360° Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                <Image
                  src={order.customer.avatar}
                  alt={order.customer.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">
                  {order.customer.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-3 mt-0.5">
                  <span className="font-mono">{order.customer.phone}</span>
                  <span>•</span>
                  <span>{order.customer.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[11px] text-zinc-400 block font-medium">
                  Delivery Destination
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {order.shippingAddress}, {order.shippingCity}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-zinc-400 block font-medium">
                  Courier Dispatch Details
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {order.courier} (Tracking: {order.trackingCode || "N/A"})
                </span>
              </div>
            </div>
          </div>

          {/* Garments & Line Items */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Garment Items ({order.items.length})
                </h3>
              </div>
              <span className="text-xs text-zinc-400">
                Atelier Handcrafted Collection
              </span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px] py-0">
                          {item.size || "Free Size"}
                        </Badge>
                        <span>{item.color || "Standard"}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      ৳{item.price.toLocaleString()} × {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Printable Luxury Invoice Layout (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl space-y-6 print:border-none print:shadow-none">
            {/* Atelier Brand Header */}
            <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                  Inspire Atelier Luxe
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Official Luxury Tax Invoice
                </p>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {order.id}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  {order.createdAt}
                </div>
              </div>
            </div>

            {/* Payment & Method Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <div className="text-[10px] uppercase font-semibold text-zinc-400">
                  Payment Method
                </div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-1 uppercase font-mono">
                  {order.paymentMethod}
                </div>
                {order.transactionId && (
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    Trx: {order.transactionId}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <div className="text-[10px] uppercase font-semibold text-zinc-400">
                  Reconciliation
                </div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 capitalize">
                  {order.paymentStatus}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Verified by concierge
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-2.5 text-xs border-t border-zinc-100 dark:border-zinc-900 pt-4">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Items Subtotal</span>
                <span className="font-mono">
                  ৳{order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Courier Delivery ({order.courier})</span>
                <span className="font-mono">
                  ৳{order.deliveryFee.toLocaleString()}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Patron Loyalty Voucher</span>
                  <span className="font-mono">
                    -৳{order.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-50 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
                <span>Grand Total</span>
                <span className="font-mono">
                  ৳{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Atelier Stamp / Seal */}
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-[11px] text-zinc-500 space-y-1">
              <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                Atelier Guarantee & Care:
              </div>
              <p>
                All garments undergo double steam press & premium dust-bag packaging before dispatch. Exchanges accepted within 7 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
