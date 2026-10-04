"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AdminOrder, AdminOrderStatus } from "@/data/admin-data";
import {
  CloseIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  CheckCircleIcon,
  PackageIcon,
  ChevronDownIcon,
} from "@/components/ui/icons";

interface OrderDetailModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: AdminOrderStatus) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [currentStatus, setCurrentStatus] = useState<AdminOrderStatus>(
    order?.orderStatus || "pending"
  );
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Sync state if order changes
  React.useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as AdminOrderStatus;
    setCurrentStatus(nextStatus);
    if (onUpdateStatus) {
      onUpdateStatus(order.id, nextStatus);
    }
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const getStatusBadge = (status: AdminOrderStatus) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "shipped":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
        className="fixed top-0 right-0 z-50 h-full w-full sm:w-[540px] md:w-[600px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250 ease-out"
      >
        {/* Top Sticky Header */}
        <div className="px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-white dark:bg-zinc-950 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <h2
                id="order-detail-title"
                className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white font-mono"
              >
                {order.id}
              </h2>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  currentStatus
                )}`}
              >
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              Ordered on {order.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Status changer select */}
            <div className="relative">
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                aria-label="Update dispatch status"
                className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300/80 dark:border-zinc-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
              >
                <option value="pending">Mark pending</option>
                <option value="processing">Mark processing</option>
                <option value="shipped">Mark shipped</option>
                <option value="delivered">Mark delivered</option>
                <option value="cancelled">Mark cancelled</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-zinc-400">
                <ChevronDownIcon size={12} />
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close order details"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* Customer CRM Card */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Customer and delivery
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {order.customer.tier}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-200 shrink-0">
                <Image
                  src={order.customer.avatar}
                  alt={order.customer.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white truncate">
                  {order.customer.name}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="inline-flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white font-medium transition-colors"
                  >
                    <PhoneIcon size={12} className="text-emerald-500" />
                    <span className="tabular-nums">{order.customer.phone}</span>
                  </a>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="inline-flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white font-medium transition-colors truncate"
                  >
                    <MailIcon size={12} className="text-blue-500" />
                    <span className="truncate">{order.customer.email}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
              <MapPinIcon size={14} className="text-zinc-400 mt-0.5 shrink-0" />
              <span>
                {order.shippingAddress} ({order.shippingCity})
              </span>
            </div>
          </div>

          {/* Line Items List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Order items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            <div className="space-y-2.5">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-950 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
                        .filter(Boolean)
                        .join(" • ") || item.category}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        Qty: <strong className="text-zinc-950 dark:text-white tabular-nums">{item.quantity}</strong>
                      </span>
                      <span className="font-mono font-bold text-zinc-950 dark:text-white tabular-nums">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Tracking Card */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <PackageIcon size={13} />
                <span>Shipping details</span>
              </span>
              <span className="text-xs font-semibold text-zinc-950 dark:text-white">
                {order.courier}
              </span>
            </div>

            {order.trackingCode && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700/70">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Tracking number</span>
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white tabular-nums">
                    {order.trackingCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyTracking(order.trackingCode || "")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
                >
                  {copiedTracking ? "Copied!" : "Copy tracking number"}
                </button>
              </div>
            )}

            {order.estimatedDelivery && (
              <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                <span>Estimated arrival:</span>
                <span className="font-semibold text-zinc-900 dark:text-white tabular-nums">
                  {order.estimatedDelivery}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Timeline Stepper */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Order timeline
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                      step.done
                        ? "bg-emerald-500 border-white dark:border-zinc-950 text-white"
                        : "bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {step.done && <CheckCircleIcon size={10} />}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        step.done
                          ? "text-zinc-950 dark:text-white"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 tabular-nums">
                      {step.time}
                    </span>
                  </div>

                  {step.note && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {step.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          {order.notes && (
            <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs">
              <span className="font-semibold text-amber-800 dark:text-amber-300 block mb-1">
                Customer note:
              </span>
              <p className="text-amber-900 dark:text-amber-200">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Bottom Financial Breakdown Footer */}
        <div className="p-6 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/90 shrink-0 space-y-3">
          <div className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-zinc-900 dark:text-white font-medium tabular-nums">
                ৳{order.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee:</span>
              <span className="font-mono text-zinc-900 dark:text-white font-medium tabular-nums">
                {order.deliveryFee === 0 ? "Complimentary" : `৳${order.deliveryFee}`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount:</span>
                <span className="font-mono font-medium tabular-nums">-৳{order.discount}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Total:
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-white tabular-nums">
                ৳{order.totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {order.paymentMethod.toUpperCase()}
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider ${
                  order.paymentStatus === "paid"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
