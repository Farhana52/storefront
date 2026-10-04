"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "@/components/ui/icons";

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  href: string;
  image: string;
  alt: string;
}

// Curated showcase slides for proportionate banner carousel
const HERO_SLIDES: HeroSlide[] = [
  {
    id: "autumn-winter",
    badge: "Autumn / Winter '26",
    title: "Curated Wardrobe Collection",
    description: "Hand-finished double-face virgin wool, pure cashmere, and sculpted tailoring.",
    ctaText: "Shop Collection",
    href: "/shop",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop",
    alt: "Autumn fashion showcase with premium outerwear",
  },
  {
    id: "minimalist-artisan",
    badge: "Signature Editorial",
    title: "Contemporary Style & Elegance",
    description: "Monochrome aesthetics with tactile natural fibers engineered for modern living.",
    ctaText: "Explore Lookbook",
    href: "/shop",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1400&auto=format&fit=crop",
    alt: "Minimalist fashion editorial showcase",
  },
  {
    id: "festive-splendor",
    badge: "Heritage Edition",
    title: "Artisanal Heritage & Festive Edition",
    description: "Curated ensembles crafted with authentic heritage embroidery and timeless elegance.",
    ctaText: "Explore Edition",
    href: "/shop",
    image: "/banners/hero-festive.jpg",
    alt: "Artisanal fashion showcase with embroidered heritage collection",
  },
  {
    id: "casual-luxe",
    badge: "Everyday Luxury",
    title: "Urban Casuals & Everyday Fashion",
    description: "Effortless chinos, structured shirts, and fine knitwear for seamless everyday wear.",
    ctaText: "Discover More",
    href: "/shop",
    image: "/banners/lifestyle-casual.jpg",
    alt: "Everyday luxury casual fashion showcase",
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Advance to next slide in circular sequence
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  // Return to previous slide
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-play interval timer with hover pause
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section className="w-full bg-zinc-50/70 dark:bg-zinc-950/70 pt-2 sm:pt-3 pb-2 sm:pb-3 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact, Proportionate Hero Slider with clean mobile clearance */}
        <div
          className="relative w-full h-[290px] sm:h-[330px] md:h-[360px] lg:h-[390px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-zinc-200/80 dark:border-zinc-800/90 group bg-zinc-100 dark:bg-zinc-900 isolate"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel slides with cross-fade transition */}
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-102"
                />

                {/* Subtle multi-layered gradient scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 pointer-events-none" />

                {/* Bottom Text Content & Action Block (bottom-11 on mobile clears indicator dots) */}
                <div className="absolute bottom-11 sm:bottom-6 md:bottom-7 left-4 right-4 sm:left-8 sm:right-8 z-20 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
                  <div className="max-w-xl">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white/90 drop-shadow-sm block mb-1 sm:mb-1.5">
                      Inspire Lifestyle
                    </span>
                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                      {slide.title}
                    </h1>
                  </div>

                  <Link
                    href={slide.href}
                    className="self-start sm:self-auto inline-flex items-center gap-2 px-4.5 py-2 sm:px-6 sm:py-3 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98] shrink-0"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Previous and Next Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous banner"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next banner"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          >
            <ChevronRightIcon size={18} />
          </button>

          {/* Slider Pagination Indicator Dots */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Switch to ${slide.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentSlide
                    ? "w-6 h-1.5 bg-white shadow-sm"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
