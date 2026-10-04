"use client";

import React, { useState, useMemo, use } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import {
  HeartIcon,
  ShoppingBagIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";

export default function ProductDetailPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const resolvedParams = params ? use(params) : null;
  const clientParams = useParams();
  const productId =
    resolvedParams?.id || (clientParams?.id as string) || "prod-1";
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Retrieve current product or fallback to first product
  const product = useMemo(() => {
    return (
      MOCK_PRODUCTS.find(
        (p) => p.id === productId || p.id === `prod-${productId}`
      ) || MOCK_PRODUCTS[0]
    );
  }, [productId]);

  // Curated 3 image angles for customer inspection
  const productImages = useMemo(() => {
    if (product.gallery && product.gallery.length >= 3) {
      return product.gallery.slice(0, 3);
    }
    return [
      product.image,
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=900&auto=format&fit=crop",
    ];
  }, [product]);

  // Gallery interactive index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Product interactive state
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Handle Add to Cart with selected options
  const handleAddToCart = () => {
    addItem(product, {
      quantity,
      selectedSize,
      openDrawer: true,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Quantity stepper adjustments
  const handleQuantityDelta = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  // Price calculations
  const hasDiscount = Boolean(
    product.originalPrice && product.originalPrice > product.price
  );

  return (
    <div className="w-full bg-stone-100/50 dark:bg-zinc-950 transition-colors min-h-[calc(100vh-200px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Container calibrated to Ghorer Bazar proportions */}
      <div className="max-w-6xl mx-auto">
        {/* Minimal Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <li>
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>&gt;</li>
            <li>
              <Link href="/shop" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Products
              </Link>
            </li>
          </ol>
        </nav>

        {/* Unified Card Frame */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Vertical Thumbnails Strip + Generous Main Image (7 Cols) */}
            <div className="lg:col-span-7 w-full flex flex-col-reverse sm:flex-row gap-4 items-center sm:items-start justify-center">
              {/* Vertical Thumbnail Column */}
              <div className="flex sm:flex-col gap-3 flex-shrink-0">
                {productImages.map((img, idx) => {
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        isSelected
                          ? "border-2 border-zinc-950 dark:border-white shadow-xs scale-102"
                          : "border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`View photo angle ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} angle ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/15 dark:bg-white/15 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-xs">
                            <CheckIcon size={12} />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Main Product Picture Box (Full size matching Ghorer Bazar box) */}
              <div className="relative aspect-square w-full max-w-[460px] sm:max-w-[480px] rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs group flex-1">
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={`${product.title} angle ${selectedImageIndex + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Tag / Badge */}
                {product.tag && (
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md bg-white/90 text-zinc-900 dark:bg-zinc-900/90 dark:text-white border border-white/20 shadow-2xs">
                      {product.tag}
                    </span>
                  </div>
                )}

                {/* Wishlist Heart Overlay */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={
                    isInWishlist(product.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className={`absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer ${
                    isInWishlist(product.id)
                      ? "bg-rose-50 dark:bg-rose-950/80 text-rose-500 scale-105"
                      : "bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-900"
                  }`}
                >
                  <HeartIcon size={18} filled={isInWishlist(product.id)} />
                </button>

                {/* Navigation Arrows for Browsing Angles */}
                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) =>
                          prev === 0 ? productImages.length - 1 : prev - 1
                        );
                      }}
                      aria-label="Previous image"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-zinc-900/85 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-xs hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all cursor-pointer opacity-70 hover:opacity-100"
                    >
                      <ChevronLeftIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) =>
                          prev === productImages.length - 1 ? 0 : prev + 1
                        );
                      }}
                      aria-label="Next image"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-zinc-900/85 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-xs hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all cursor-pointer opacity-70 hover:opacity-100"
                    >
                      <ChevronRightIcon size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Title, Price, Quantity, & Add To Cart (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-start space-y-5 pt-1">
              {/* Product Title */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white leading-snug">
                  {product.title}
                </h1>

                {/* Product Price */}
                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
                    ৳{product.price.toLocaleString("en-US")}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm sm:text-base text-zinc-400 line-through font-normal">
                      ৳{product.originalPrice?.toLocaleString("en-US")}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-200/80 dark:border-zinc-800 pt-5 space-y-4">
                {/* Size Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 min-w-18">
                    Size:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(product.sizes || ["S", "M", "L", "XL"]).map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`h-10 min-w-10 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isSelected
                              ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs ring-1 ring-zinc-950 dark:ring-white"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Stepper Row */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 min-w-18">
                    Quantity:
                  </span>
                  <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleQuantityDelta(-1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold text-base"
                    >
                      &minus;
                    </button>
                    <span className="w-12 text-center font-bold text-base text-zinc-950 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityDelta(1)}
                      disabled={quantity >= 10}
                      aria-label="Increase quantity"
                      className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold text-base"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Button: Add To Cart */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full h-12.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 active:scale-[0.99]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckIcon size={16} />
                      <span>ADDED TO CART</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBagIcon size={16} />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
