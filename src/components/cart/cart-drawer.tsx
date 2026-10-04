"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalItems,
    subtotal,
  } = useCart();

  // Prevent background scrolling while cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Cart Drawer Panel */}
      <aside
        id="cart-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 pointer-events-auto visible opacity-100"
            : "translate-x-full pointer-events-none invisible opacity-0"
        }`}
      >
        {/* Header: SHOPPING CART & Close -> */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/80 dark:border-zinc-800">
          <h2 className="text-sm font-extrabold tracking-wider text-zinc-950 dark:text-white uppercase">
            Shopping Cart {totalItems > 0 && `(${totalItems})`}
          </h2>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close shopping cart"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <span>Close</span>
            <ArrowRightIcon size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-zinc-500">
              <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3 text-zinc-400">
                <ShoppingBagIcon size={24} />
              </div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                Your Cart is Empty
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-[200px]">
                Add items to your bag to view them here.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-5 px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold tracking-wider uppercase hover:opacity-90 transition-opacity"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const itemKey = `${item.product.id}-${item.selectedSize}-${item.selectedColor}`;
              const lineTotal = item.product.price * item.quantity;

              return (
                <div
                  key={itemKey}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  {/* Thumbnail Image */}
                  <Link
                    href={`/shop/${item.product.id}`}
                    onClick={closeCart}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/80 dark:border-zinc-700/80 p-0.5"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      sizes="64px"
                      className="object-cover rounded-lg"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.product.id}`}
                      onClick={closeCart}
                      className="block text-xs sm:text-[13px] font-semibold text-zinc-950 dark:text-white hover:underline truncate"
                    >
                      {item.product.title}
                    </Link>

                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {[item.selectedSize, item.selectedColor].filter(Boolean).join(" / ")}
                      </p>
                    )}

                    {/* Quantity Selector + Price Calculation Formula */}
                    <div className="flex items-center gap-2 mt-2">
                      {/* [ - 1 + ] Counter */}
                      <div className="inline-flex items-center border border-zinc-200 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/80 px-1 py-0.5">
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
                          className="p-1 text-zinc-500 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
                        >
                          <MinusIcon size={10} />
                        </button>
                        <span className="px-1.5 text-xs font-semibold text-zinc-950 dark:text-white min-w-[16px] text-center">
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
                          className="p-1 text-zinc-500 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
                        >
                          <PlusIcon size={10} />
                        </button>
                      </div>

                      {/* Formula: x ৳price = ৳total */}
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        &times; ৳{item.product.price.toLocaleString()} ={" "}
                        <strong className="text-zinc-950 dark:text-white font-bold">
                          ৳{lineTotal.toLocaleString()}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Remove Button (X icon on far right) */}
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        item.product.id,
                        item.selectedSize,
                        item.selectedColor
                      )
                    }
                    aria-label={`Remove ${item.product.title}`}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <CloseIcon size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Total and Solid Order / Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3 shrink-0 pb-6 sm:pb-5">
            {/* Total Row */}
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                Total:
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white font-mono">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>

            {/* Solid Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 sm:py-4 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center hover:opacity-90 active:scale-[0.99] transition-all shadow-md cursor-pointer"
            >
              <span>CHECKOUT</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};
