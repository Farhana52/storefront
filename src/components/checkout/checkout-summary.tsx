"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/types";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost?: number;
  deliveryMethodName?: string;
  appliedPromo: string | null;
  discountAmount: number;
  taxAmount?: number;
  totalAmount: number;
  isSubmitting: boolean;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  onSubmitOrder: () => void;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  subtotal,
  shippingCost = 0,
  appliedPromo,
  discountAmount,
  totalAmount,
  isSubmitting,
  onApplyPromo,
  onRemovePromo,
  onSubmitOrder,
}) => {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const success = onApplyPromo(promoInput);
    if (success) {
      setPromoError("");
      setPromoInput("");
    } else {
      setPromoError("Invalid code. Try 'INSPIRE10' or 'WELCOME20'.");
    }
  };

  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
            Order Summary
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {totalCount} {totalCount === 1 ? "item" : "items"}
          </span>
        </div>
        <Link
          href="/cart"
          className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition-colors"
        >
          Edit Cart
        </Link>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {items.map((item) => {
          const itemKey = `${item.product.id}-${item.selectedSize}-${item.selectedColor}`;
          return (
            <div key={itemKey} className="pt-3 first:pt-0 flex items-center gap-3">
              <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
                <Image
                  src={item.product.image}
                  alt={item.product.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-zinc-950 dark:text-white truncate">
                  {item.product.title}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Qty: {item.quantity}
                  {item.selectedSize && ` • Size: ${item.selectedSize}`}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs font-bold text-zinc-950 dark:text-white">
                  ৳{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code Input */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <form onSubmit={handlePromoSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Promo code (e.g. INSPIRE10)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Apply
            </button>
          </div>

          {promoError && (
            <p className="text-[11px] text-rose-500 font-medium">{promoError}</p>
          )}

          {appliedPromo && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs">
              <span className="font-mono font-bold flex items-center gap-1.5">
                <CheckIcon size={12} /> {appliedPromo} applied
              </span>
              <button
                type="button"
                onClick={onRemovePromo}
                aria-label="Remove promo code"
                className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                <CloseIcon size={14} />
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 pt-2 text-xs border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Subtotal</span>
          <span className="font-semibold text-zinc-950 dark:text-white">
            ৳{subtotal.toLocaleString()}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Discount</span>
            <span className="font-semibold text-zinc-950 dark:text-white">
              -৳{discountAmount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Delivery</span>
          <span className="font-semibold text-zinc-950 dark:text-white">
            {shippingCost === 0 ? "FREE" : `৳${shippingCost.toLocaleString()}`}
          </span>
        </div>

        <div className="flex justify-between items-baseline pt-3 border-t border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white">
          <span className="text-xs font-bold uppercase tracking-wider">Total</span>
          <span className="text-xl font-extrabold tracking-tight">
            ৳{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Place Order CTA Button */}
      <button
        type="button"
        disabled={isSubmitting || items.length === 0}
        onClick={onSubmitOrder}
        className="w-full py-3.5 px-6 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
      >
        {isSubmitting ? (
          <span>Processing Order...</span>
        ) : (
          <span>Place Order</span>
        )}
      </button>
    </div>
  );
};
