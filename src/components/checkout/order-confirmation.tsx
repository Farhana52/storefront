"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, CheckoutFormData } from "@/types";
import { CheckIcon, PackageIcon, TruckIcon, ShieldCheckIcon } from "@/components/ui/icons";

interface OrderConfirmationProps {
  orderId: string;
  orderDate: string;
  formData: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  onResetCheckout: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  orderDate,
  formData,
  items,
  subtotal,
  discountAmount,
  shippingCost,
  taxAmount,
  totalAmount,
  onResetCheckout,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Success Hero Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-10 border border-zinc-200/80 dark:border-zinc-800 shadow-sm text-center relative overflow-hidden">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white mx-auto flex items-center justify-center mb-5 shadow-sm">
          <CheckIcon size={32} />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mb-3">
          Order Confirmed • {orderId}
        </span>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Thank you, {formData.fullName || "Valued Patron"}!
        </h1>

        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg mx-auto">
          Your order has been authorized and dispatched to our fulfillment center. A detailed confirmation receipt has been emailed to{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formData.email}</span>.
        </p>

        {/* Timeline Status */}
        <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-2 relative">
            {/* Connecting line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
            <div className="absolute top-4 left-6 w-1/3 h-0.5 bg-zinc-900 dark:bg-white -z-0" />

            {/* Step 1: Confirmed */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center text-xs font-bold shadow-xs">
                <CheckIcon size={14} />
              </div>
              <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                Confirmed
              </span>
              <span className="text-[10px] text-zinc-400">Today</span>
            </div>

            {/* Step 2: Preparing */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center text-xs font-bold shadow-xs">
                <PackageIcon size={14} />
              </div>
              <span className="text-[11px] font-bold text-zinc-950 dark:text-white mt-2">
                Order Prep
              </span>
              <span className="text-[10px] text-zinc-400">In Progress</span>
            </div>

            {/* Step 3: Shipped */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs">
                <TruckIcon size={14} />
              </div>
              <span className="text-[11px] font-medium text-zinc-400 mt-2">Shipped</span>
              <span className="text-[10px] text-zinc-400">Upcoming</span>
            </div>

            {/* Step 4: Delivered */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs">
                <CheckIcon size={14} />
              </div>
              <span className="text-[11px] font-medium text-zinc-400 mt-2">Delivered</span>
              <span className="text-[10px] text-zinc-400">Est. 3-5 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping & Delivery Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
            <TruckIcon size={16} className="text-zinc-900 dark:text-white" />
            <span>Shipping & Delivery Information</span>
          </div>

          <div className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
            <p className="font-bold text-sm text-zinc-950 dark:text-white">{formData.fullName}</p>
            <p>{formData.streetAddress}</p>
            {formData.apartment && <p>{formData.apartment}</p>}
            <p>
              {formData.city}, {formData.stateProvince} {formData.postalCode}
            </p>
            <p className="font-medium text-zinc-900 dark:text-zinc-200">{formData.country}</p>
            <p className="pt-2 text-zinc-500">Contact: {formData.phone}</p>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Delivery Method
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-white capitalize">
              {formData.deliveryMethod === "standard"
                ? "Standard Ground Delivery (3–5 Days)"
                : formData.deliveryMethod === "express"
                ? "Express Air Courier (1–2 Days)"
                : "White Glove Inspire Concierge (Next-Day)"}
            </span>
          </div>
        </div>

        {/* Payment & Security Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
            <ShieldCheckIcon size={16} className="text-zinc-900 dark:text-white" />
            <span>Payment Summary</span>
          </div>

          <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Method
              </span>
              <p className="font-bold text-zinc-950 dark:text-white">
                {formData.paymentMethod === "card"
                  ? `Credit Card •••• ${formData.cardNumber ? formData.cardNumber.slice(-4) : "8921"}`
                  : formData.paymentMethod === "cod"
                  ? "Cash on Delivery (Pay at Doorstep)"
                  : `Mobile Wallet (${formData.mobileProvider?.toUpperCase() || "bKash"})`}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Order Placement Date
              </span>
              <p className="text-zinc-800 dark:text-zinc-200 font-mono">{orderDate}</p>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">৳{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="font-medium">-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Shipping</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {shippingCost === 0 ? "FREE" : `৳${shippingCost.toLocaleString()}`}
                </span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">৳{taxAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-zinc-950 dark:text-white pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                <span>Total Authorized</span>
                <span>৳{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products List */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-800">
          Items in this Shipment ({items.length})
        </h3>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
              className="py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-white truncate">
                    {item.product.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Qty: {item.quantity} • Size: {item.selectedSize || "M"} • Color:{" "}
                    {item.selectedColor || "Standard"}
                  </p>
                  <p className="text-xs font-mono text-zinc-400 mt-1">৳{item.product.price.toLocaleString()} each</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-sm font-extrabold text-zinc-950 dark:text-white">
                  ৳{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold text-xs tracking-wider uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
        >
          Print Invoice / Receipt
        </button>

        <Link
          href="/shop"
          onClick={onResetCheckout}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-xs text-center cursor-pointer"
        >
          Continue Shopping
        </Link>

        <Link
          href="/"
          onClick={onResetCheckout}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-semibold text-xs tracking-wider uppercase transition-colors text-center"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};
