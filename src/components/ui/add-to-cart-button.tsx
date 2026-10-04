"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import { ShoppingBagIcon, PlusIcon, MinusIcon, TrashIcon } from "@/components/ui/icons";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  size?: "default" | "large" | "compact";
  showBagLabel?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  className = "",
  size = "default",
  showBagLabel = true,
}) => {
  const { getItemQuantity, addItem, updateQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddFirst = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    addItem(product, { quantity: 1, openDrawer: false });
    setTimeout(() => setIsAnimating(false), 250);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    updateQuantity(product.id, 1);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    updateQuantity(product.id, -1);
    setTimeout(() => setIsAnimating(false), 200);
  };

  // Dimensions based on size prop
  const heightClass =
    size === "large"
      ? "h-12 sm:h-13 text-xs uppercase tracking-wider"
      : size === "compact"
      ? "h-8 text-[11px]"
      : "h-9 sm:h-10 text-xs";

  // When product is NOT in cart, display standard Add to Cart button
  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={handleAddFirst}
        aria-label={`Add ${product.title} to cart`}
        className={`w-full ${heightClass} px-3 rounded-xl border border-zinc-950 dark:border-white text-zinc-950 dark:text-white bg-transparent hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 font-semibold tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98] ${className}`}
      >
        <ShoppingBagIcon size={size === "large" ? 18 : 14} />
        <span>Add To Cart</span>
      </button>
    );
  }

  // When product IS in cart, display elegant + / - stepper control
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`w-full ${heightClass} px-1 rounded-xl border border-zinc-950 dark:border-white bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold flex items-center justify-between transition-all shadow-2xs select-none ${
        isAnimating ? "scale-[1.01]" : ""
      } ${className}`}
    >
      {/* Minus / Remove button */}
      <button
        type="button"
        onClick={handleDecrement}
        aria-label={`Remove one ${product.title}`}
        className="w-8 h-7.5 sm:w-8.5 sm:h-8 rounded-lg flex items-center justify-center text-white dark:text-zinc-950 hover:bg-white/15 dark:hover:bg-zinc-900/15 active:scale-85 transition-all cursor-pointer"
      >
        {quantity === 1 ? (
          <TrashIcon size={14} className="opacity-90" />
        ) : (
          <MinusIcon size={14} strokeWidth="2.5" />
        )}
      </button>

      {/* Quantity Display */}
      <div className="flex-1 flex items-center justify-center gap-1.5 px-1 min-w-0">
        <span className="font-mono font-bold text-xs sm:text-sm tracking-tight">
          {quantity}
        </span>
        {showBagLabel && (
          <span className="text-[10px] sm:text-[11px] font-medium opacity-80 uppercase tracking-widest hidden xs:inline">
            in cart
          </span>
        )}
      </div>

      {/* Plus button */}
      <button
        type="button"
        onClick={handleIncrement}
        aria-label={`Add one more ${product.title}`}
        className="w-8 h-7.5 sm:w-8.5 sm:h-8 rounded-lg flex items-center justify-center text-white dark:text-zinc-950 hover:bg-white/15 dark:hover:bg-zinc-900/15 active:scale-85 transition-all cursor-pointer"
      >
        <PlusIcon size={14} strokeWidth="2.5" />
      </button>
    </div>
  );
};
