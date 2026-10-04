"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { useWishlist } from "@/context/wishlist-context";
import { ArrowRightIcon, HeartIcon } from "@/components/ui/icons";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

const FILTER_TABS = [
  "All Editions",
  "Fashion",
  "Hijab",
  "Beauty",
  "Accessories",
  "Collections",
] as const;

export const ProductGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All Editions");
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Filter products based on selected category tab
  const filteredProducts =
    activeTab === "All Editions"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((product) => product.category === activeTab);

  return (
    <section id="featured" className="pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 bg-stone-50/40 dark:bg-zinc-950 border-t border-zinc-200/60 dark:border-zinc-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Title and CTA */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Featured Collection
          </h2>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group shrink-0"
          >
            <span>Shop All</span>
            <span className="group-hover:translate-x-1 transition-transform">
              <ArrowRightIcon size={15} />
            </span>
          </Link>
        </div>

        {/* Filter Pills with Horizontal Scroll on Small Devices */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 sm:mb-8">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Grid: 4-col desktop, 2-3 col tablet, 2-col mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product) => {
            const isDiscounted = Boolean(product.originalPrice && product.originalPrice > product.price);
            const discountPercent = isDiscounted
              ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                {/* Image Container with Badges & Wishlist */}
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
                      aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      className={`absolute top-2 right-2 z-20 w-8.5 h-8.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-xs active:scale-90 ${isInWishlist(product.id)
                          ? "bg-white text-rose-500 shadow-sm"
                          : "bg-white/85 dark:bg-zinc-900/85 text-zinc-600 dark:text-zinc-300 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-900"
                        }`}
                    >
                      <HeartIcon
                        size={15}
                        filled={isInWishlist(product.id)}
                        className={isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : ""}
                      />
                    </button>
                  </div>

                  {/* Product Title Only */}
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2.5 sm:mt-3 line-clamp-1 hover:underline">
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
