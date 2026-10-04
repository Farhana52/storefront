"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface CategoryItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

import { useCMS } from "@/context/cms-context";

// Fallback category items
const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: "fashion",
    title: "Fashion & Tailoring",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
    href: "/shop?category=Fashion",
  },
  {
    id: "hijab",
    title: "Hijab & Scarves",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
    href: "/shop?category=Hijab",
  },
  {
    id: "beauty",
    title: "Beauty & Botanical",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
    href: "/shop?category=Beauty",
  },
  {
    id: "accessories",
    title: "Jewelry & Leather",
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=900&auto=format&fit=crop",
    href: "/shop?category=Accessories",
  },
];

export const FeaturedCategories: React.FC = () => {
  const { categories } = useCMS();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayCategories =
    categories && categories.length > 0
      ? categories.map((c) => ({
          id: c.id,
          title: c.name,
          image: c.image || "/products/festive-gown.jpg",
          href: `/shop?category=${encodeURIComponent(c.name)}`,
        }))
      : FALLBACK_CATEGORIES;

  // Monitor scroll position to update navigation arrow states
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  // Smooth scroll handler for chevron navigation buttons
  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="categories" className="py-8 sm:py-12 lg:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header with Title, Subtitle and Carousel Navigation */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Popular Categories
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 hidden sm:block">
            Explore trending styles and curated daily essentials
          </p>
        </div>

        {/* Navigation arrows matching design system */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous categories"
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Next categories"
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel: 6-7 items visible on desktop, swipeable on mobile */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex items-start gap-4 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
      >
        {displayCategories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group flex flex-col items-center flex-shrink-0 w-[120px] sm:w-[140px] md:w-[150px] lg:w-[156px] text-center focus:outline-none"
          >
            {/* Circular Category Image Container */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-[145px] lg:h-[145px] rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-2 ring-transparent group-hover:ring-zinc-300 dark:group-hover:ring-zinc-600 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 156px"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>

            {/* Category Name Label */}
            <span className="mt-3 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 px-1 leading-snug">
              {cat.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
