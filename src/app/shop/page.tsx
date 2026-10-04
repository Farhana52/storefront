"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/wishlist-context";
import { useCMS } from "@/context/cms-context";
import {
  HeartIcon,
  FilterIcon,
  CloseIcon,
  CheckIcon,
} from "@/components/ui/icons";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

const PRICE_RANGES = [
  { id: "all", label: "All Prices" },
  { id: "under-1000", label: "Under ৳1,000" },
  { id: "1000-2000", label: "৳1,000 – ৳2,000" },
  { id: "2000-3500", label: "৳2,000 – ৳3,500" },
  { id: "over-3500", label: "৳3,500 & Above" },
];

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
  { id: "name", label: "Alphabetical (A–Z)" },
];

export default function ShopPage() {
  const { products, categories: cmsCategories } = useCMS();
  const categoriesList = useMemo(
    () => ["All", ...cmsCategories.map((c) => c.name)],
    [cmsCategories]
  );

  // State management for filters and sorting
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // UI state for filters drawer/sidebar
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(true);
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Compute active filters count
  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedPriceRange !== "all" ? 1 : 0);

  // Clear all filters back to default
  const handleClearAll = () => {
    setSelectedCategory("All");
    setSelectedPriceRange("all");
    setSortBy("featured");
  };

  // Pure client-side filtering and sorting of products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedPriceRange === "under-1000") {
      result = result.filter((p) => p.price < 1000);
    } else if (selectedPriceRange === "1000-2000") {
      result = result.filter((p) => p.price >= 1000 && p.price <= 2000);
    } else if (selectedPriceRange === "2000-3500") {
      result = result.filter((p) => p.price > 2000 && p.price <= 3500);
    } else if (selectedPriceRange === "over-3500") {
      result = result.filter((p) => p.price > 3500);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [
    selectedCategory,
    selectedPriceRange,
    sortBy,
  ]);

  // Filter content helper reused between desktop sidebar and mobile drawer
  const renderFilterControls = () => (
    <div className="space-y-6 sm:space-y-7">
      {/* Category filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-100 mb-3">
          Category
        </h3>
        <div className="space-y-1.5">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <span>{cat}</span>
                {isSelected && <CheckIcon size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range filter */}
      <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-100 mb-3">
          Price Range
        </h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const isSelected = selectedPriceRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => setSelectedPriceRange(range.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <span>{range.label}</span>
                {isSelected && <CheckIcon size={14} />}
              </button>
            );
          })}
        </div>
      </div>



      {/* Clear all filters */}
      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={handleClearAll}
          className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          Reset All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full bg-stone-50/50 dark:bg-zinc-950 transition-colors min-h-screen">
      {/* Top Header & Breadcrumb Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-2 sm:pb-3">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-2 sm:mb-2.5">
          <ol className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <li>
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-zinc-900 dark:text-white font-medium">Shop</span>
            </li>
            {selectedCategory !== "All" && (
              <>
                <li>/</li>
                <li className="text-blue-600 dark:text-blue-400 font-medium">
                  {selectedCategory}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-4 sm:mb-5">
          Shop All Collections
        </h1>

        {/* Responsive Toolbar: Product Count, Filter Toggle & Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-4 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 shadow-xs mb-6 sm:mb-8">
          {/* Left Side: Product Count & Filter Triggers */}
          <div className="flex items-center gap-3">
            {/* Desktop Sidebar Toggle */}
            <button
              type="button"
              onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <FilterIcon size={14} />
              <span>{isDesktopSidebarOpen ? "Hide Filters" : "Show Filters"}</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Mobile Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <FilterIcon size={14} />
              <span>Filter & Refine</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Showing <span className="font-semibold text-zinc-900 dark:text-white">{filteredProducts.length}</span> Products
            </span>
          </div>

          {/* Right Side: Sort By Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hidden sm:inline-block">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Active filters:</span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  &times;
                </button>
              </span>
            )}
            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {PRICE_RANGES.find((r) => r.id === selectedPriceRange)?.label}
                <button
                  type="button"
                  onClick={() => setSelectedPriceRange("all")}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  &times;
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="flex items-start gap-8 pb-20">
          {/* Desktop Sidebar (Collapsible) */}
          {isDesktopSidebarOpen && (
            <aside className="hidden lg:block w-64 flex-shrink-0 p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 sticky top-24 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                  Filter Products
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
              {renderFilterControls()}
            </aside>
          )}

          {/* Product Grid Area: 4-col desktop, 2-3 col tablet, 2-col mobile */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 p-8 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <FilterIcon size={22} />
                </div>
                <h3 className="text-base font-semibold text-zinc-950 dark:text-white mb-1">
                  No matching garments found
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
                  We could not find any products matching your specific combination of filters. Try resetting your criteria.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-2 ${
                  isDesktopSidebarOpen
                    ? "md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "md:grid-cols-3 lg:grid-cols-4"
                } gap-3.5 sm:gap-5 lg:gap-6`}
              >
                {filteredProducts.map((product) => {
                  const isWishlisted = isInWishlist(product.id);
                  const isDiscounted = Boolean(product.originalPrice && product.originalPrice > product.price);
                  const discountPercent = isDiscounted
                    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                    : 0;

                  return (
                    <div
                      key={product.id}
                      className="group p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      {/* Product Image Container */}
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

                          {/* Wishlist Heart Icon Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product);
                            }}
                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            className={`absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer ${
                              isWishlisted
                                ? "bg-white text-rose-500 shadow-sm"
                                : "bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-900"
                            }`}
                          >
                            <HeartIcon size={15} filled={isWishlisted} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
                          </button>
                        </div>

                        {/* Product Title Only */}
                        <h2 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2.5 sm:mt-3 line-clamp-1 hover:underline">
                          <Link href={`/shop/${product.id}`}>{product.title}</Link>
                        </h2>

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
          </main>
        </div>
      </div>

      {/* Mobile Slide-Out Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white dark:bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-l border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                    Refine Products
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {filteredProducts.length} items found
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
                >
                  <CloseIcon size={18} />
                </button>
              </div>

              {renderFilterControls()}
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-8 flex gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-center"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm cursor-pointer text-center"
              >
                View {filteredProducts.length} Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
