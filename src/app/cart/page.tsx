"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import {
  ShoppingBagIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckIcon,
} from "@/components/ui/icons";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    addItem,
    totalItems,
    subtotal,
  } = useCart();

  // State for promo code
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>("INSPIRE10");
  const [promoError, setPromoError] = useState("");
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Free shipping threshold logic (৳2,500)
  const freeShippingThreshold = 2500;
  const shippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercentage = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo === "INSPIRE10" || appliedPromo === "ATELIER10") return Math.round(subtotal * 0.1);
    return 0;
  }, [appliedPromo, subtotal]);

  const shippingCost = items.length === 0 ? 0 : shippingRemaining === 0 ? 0 : 120;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  // Handle promo code application
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "INSPIRE10" || code === "ATELIER10") {
      setAppliedPromo("INSPIRE10");
      setPromoError("");
    } else {
      setPromoError("Invalid promotional code. Try 'INSPIRE10'");
    }
  };

  // Toggle wishlist for a cart item
  const handleSaveToWishlist = (product: (typeof items)[0]["product"]) => {
    toggleWishlist(product);
  };


  // Suggested products when bag is empty
  const suggestedProducts = useMemo(() => {
    return MOCK_PRODUCTS.slice(0, 4);
  }, []);

  return (
    <div className="w-full bg-stone-50/40 dark:bg-zinc-950 transition-colors min-h-screen pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <li>
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-zinc-900 dark:text-white font-medium">Shopping Bag</span>
            </li>
          </ol>
        </nav>

        {/* Page Title & Count */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Order Bag
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Shopping Bag ({totalItems})
            </h1>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider self-start sm:self-auto"
          >
            <span>Continue Shopping</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          /* Empty Bag State with Curated Suggestions */
          <div className="space-y-16">
            <div className="text-center py-16 px-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 max-w-2xl mx-auto shadow-xs">
              <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-5 text-zinc-400">
                <ShoppingBagIcon size={36} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                Your shopping bag is currently empty
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
                You have not selected any garments yet. Explore our curated permanent collection of tailored outerwear, Mongolian cashmere, and artisanal leather goods.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-600/20"
              >
                <span>Explore Full Collection</span>
                <ArrowRightIcon size={16} />
              </Link>
            </div>

            {/* Curated Recommendations for Empty Cart */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500">
                    Recommended For You
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white mt-0.5">
                    Trending Permanent Essentials
                  </h3>
                </div>
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {suggestedProducts.map((p) => (
                  <div key={p.id} className="group flex flex-col justify-between">
                    <Link
                      href={`/shop/${p.id}`}
                      className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs block"
                    >
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                    </Link>
                    <div className="pt-3 flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {p.category}
                      </span>
                      <Link
                        href={`/shop/${p.id}`}
                        className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white mt-0.5 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      >
                        {p.title}
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">
                          ৳{p.price.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(p)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Cart Layout: 8-Column Items List + 4-Column Sticky Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Cart Items & Controls (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                  <div className="flex items-center gap-2">
                    <TruckIcon size={18} className="text-blue-600 dark:text-blue-400" />
                    <span>
                      {shippingRemaining === 0
                        ? "You have unlocked complimentary express priority delivery!"
                        : `Add ৳${shippingRemaining.toLocaleString()} more to unlock free express shipping`}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 self-end sm:self-auto">
                    {freeShippingPercentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingPercentage}%` }}
                  />
                </div>
              </div>

              {/* Items Table Container */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
                {/* Table Header on Desktop */}
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-4 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <div className="col-span-6">Garment Details</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Subtotal</div>
                </div>

                {/* Items Rows */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {items.map((item) => {
                    const itemKey = `${item.product.id}-${item.selectedSize}-${item.selectedColor}`;
                    const isWishlisted = isInWishlist(item.product.id);

                    return (
                      <div
                        key={itemKey}
                        className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                      >
                        {/* Thumbnail & Product Details (6 Cols on Desktop) */}
                        <div className="sm:col-span-6 flex gap-4">
                          <Link
                            href={`/shop/${item.product.id}`}
                            className="relative w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0 border border-zinc-200/70 dark:border-zinc-800 group"
                          >
                            <Image
                              src={item.product.image}
                              alt={item.product.title}
                              fill
                              sizes="96px"
                              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>

                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                {item.product.category}
                              </span>
                              <Link
                                href={`/shop/${item.product.id}`}
                                className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 block"
                              >
                                {item.product.title}
                              </Link>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {item.selectedSize && (
                                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                                    Size: {item.selectedSize}
                                  </span>
                                )}
                                {item.selectedColor && (
                                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                                    {item.selectedColor}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 sm:hidden mt-2">
                              ৳{item.product.price.toLocaleString()} each
                            </span>

                            {/* Wishlist & Remove Action Buttons */}
                            <div className="flex items-center gap-4 pt-2">
                              <button
                                type="button"
                                onClick={() => handleSaveToWishlist(item.product)}
                                className={`inline-flex items-center gap-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                                  isWishlisted
                                    ? "text-rose-600 dark:text-rose-400"
                                    : "text-zinc-500 hover:text-rose-600 dark:text-zinc-400"
                                }`}
                              >
                                <HeartIcon size={13} filled={isWishlisted} />
                                <span>{isWishlisted ? "Saved" : "Save to Wishlist"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(
                                    item.product.id,
                                    item.selectedSize,
                                    item.selectedColor
                                  )
                                }
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <TrashIcon size={12} />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Stepper (3 Cols on Desktop) */}
                        <div className="sm:col-span-3 flex sm:justify-center items-center">
                          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 px-2 py-1 shadow-2xs">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  -1,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                              aria-label="Decrease quantity"
                              className="w-7 h-7 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-lg cursor-pointer"
                            >
                              <MinusIcon size={13} />
                            </button>
                            <span className="w-10 text-center font-bold text-xs text-zinc-950 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  1,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                              aria-label="Increase quantity"
                              className="w-7 h-7 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-lg cursor-pointer"
                            >
                              <PlusIcon size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal per Line Item (3 Cols on Desktop) */}
                        <div className="sm:col-span-3 text-right">
                          <span className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white">
                            ৳{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Table Footer with Clear All */}
                <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    &larr; <span>Back to Shop</span>
                  </Link>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Clear Shopping Bag
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card (4 Cols, Sticky) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5">
                <h2 className="text-base font-bold uppercase tracking-wider text-zinc-950 dark:text-white pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
                  Order Summary
                </h2>

                {/* Promo Code Input Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label htmlFor="promo-input" className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Promotional Voucher
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo-input"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. INSPIRE10"
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>

                  {promoError && (
                    <p className="text-[11px] text-rose-500 font-medium">{promoError}</p>
                  )}

                  {appliedPromo && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <CheckIcon size={14} />
                        <span>Code &lsquo;{appliedPromo}&rsquo; Applied (10% Off)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setAppliedPromo(null)}
                        className="text-xs hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Calculations Breakdown */}
                <div className="space-y-3 pt-2 text-xs border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-950 dark:text-white">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Promotional Discount (10%)</span>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Estimated Express Shipping</span>
                    <span className="font-semibold text-zinc-950 dark:text-white">
                      {shippingCost === 0 ? "FREE" : `৳${shippingCost.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Estimated Taxes</span>
                    <span className="font-medium text-zinc-500">Calculated at checkout</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-baseline pt-4 border-t border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white">
                    <span className="text-sm font-bold uppercase tracking-wider">Estimated Total</span>
                    <span className="text-2xl font-extrabold">৳{estimatedTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Proceed to Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/30 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <ShieldCheckIcon size={18} />
                  <span>Proceed to Checkout</span>
                </Link>

                {/* Trust Badges */}
                <div className="pt-2 space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <CheckIcon size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>256-bit encrypted secure checkout experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>30-day effortless returns with complimentary home pickup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
