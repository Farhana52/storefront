"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, HeartIcon } from "@/components/ui/icons";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { useWishlist } from "@/context/wishlist-context";
import { AccessoriesBanner } from "./accessories-banner";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

export const AccessoriesSection: React.FC = () => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Showcase all accessories and gadgets items dynamically
  const accessories = MOCK_PRODUCTS.filter(
    (product) => product.category === "Accessories"
  );

  return (
    <section className="pt-5 sm:pt-7 pb-8 sm:pb-10 lg:pb-12 bg-stone-50/40 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curated Accessories Editorial Banner (Ghorer Bazar Style) */}
        <AccessoriesBanner />

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase">
              Accessories
            </h2>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mt-0.5 block">
              {accessories.length} Items
            </span>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-all shadow-xs group"
          >
            <span>View All</span>
            <ArrowRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Accessories Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {accessories.map((product) => {
            const isSaved = isInWishlist(product.id);
            const isDiscounted = Boolean(product.originalPrice && product.originalPrice > product.price);
            const discountPercent = isDiscounted
              ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                {/* Image Box with Badges & Wishlist */}
                <div>
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800/60">
                    <Link href={`/shop/${product.id}`} className="absolute inset-0 z-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
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

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                      className={`absolute top-2 right-2 z-20 w-8.5 h-8.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-xs active:scale-90 ${isSaved
                          ? "bg-white text-rose-500 shadow-sm"
                          : "bg-white/85 dark:bg-zinc-900/85 text-zinc-600 dark:text-zinc-300 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-900"
                        }`}
                    >
                      <HeartIcon
                        size={15}
                        filled={isSaved}
                        className={isSaved ? "fill-rose-500 text-rose-500" : ""}
                      />
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
      </div>
    </section>
  );
};
