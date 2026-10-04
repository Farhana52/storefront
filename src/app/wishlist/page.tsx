"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/wishlist-context";
import {
  HeartIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="w-full bg-stone-50/40 dark:bg-zinc-950 transition-colors pb-12 sm:pb-16">
      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-3 sm:pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase">
          PERSONAL WISHLIST
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          /* Empty Wishlist State */
          <div className="max-w-md mx-auto py-8 sm:py-14 text-center">
            <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center mx-auto mb-3.5 text-zinc-400">
              <HeartIcon size={24} />
            </div>

            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Your wishlist is empty
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-5">
              Explore our collection to add and save your favorite pieces.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition-opacity shadow-xs"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          /* Populated Wishlist Layout */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {items.map((product) => {
                const isDiscounted = Boolean(product.originalPrice && product.originalPrice > product.price);
                const discountPercent = isDiscounted
                  ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="group p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    {/* Image and Badges */}
                    <div>
                      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800/60">
                        <Link href={`/shop/${product.id}`} className="absolute inset-0">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Discount Badge */}
                        {isDiscounted && (
                          <div className="absolute top-2 left-2 z-10 pointer-events-none">
                            <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs">
                              Save {discountPercent}%
                            </span>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(product.id)}
                          aria-label="Remove from wishlist"
                          className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-900 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>

                      {/* Product Title Only */}
                      <h3 className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white mt-2.5 sm:mt-3 line-clamp-1 hover:underline">
                        <Link href={`/shop/${product.id}`}>{product.title}</Link>
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-white">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {isDiscounted && (
                          <span className="text-[11px] sm:text-xs text-zinc-400 line-through">
                            ৳{product.originalPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Add To Cart & Stepper Button */}
                    <div className="mt-3">
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                );
              })}
            </div>
        )}
      </div>
    </div>
  );
}
