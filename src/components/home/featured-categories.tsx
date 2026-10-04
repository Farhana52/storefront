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

// Popular e-commerce category mock data matching user specifications
const POPULAR_CATEGORIES: CategoryItem[] = [
  {
    id: "mens-chino-pant",
    title: "Men’s Chino Pant",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    href: "/shop",
  },
  {
    id: "hair-dryers",
    title: "Hair Dryers",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
    href: "/shop",
  },
  {
    id: "mens-panjabi",
    title: "Men’s Panjabi",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop",
    href: "/shop",
  },
  {
    id: "womens-bottom-wear",
    title: "Women’s Bottom Wear",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
    href: "/shop",
  },
  {
    id: "mens-casual-shirt",
    title: "Men’s Casual Shirt",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
    href: "/shop",
  },
  {
    id: "footwear",
    title: "Footwear",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
    href: "/shop",
  },
  {
    id: "mens-polo",
    title: "Men’s Polo",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop",
    href: "/shop",
  },
  {
    id: "winter-collection",
    title: "Winter Collection",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop",
    href: "/shop",
  },
];

export const FeaturedCategories: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
        {POPULAR_CATEGORIES.map((cat) => (
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
