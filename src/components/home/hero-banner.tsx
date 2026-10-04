"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCMS } from "@/context/cms-context";
import { DEFAULT_HERO_SLIDES } from "@/data/cms-defaults";

export const HeroBanner: React.FC = () => {
  const { heroSlides } = useCMS();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Active slides from CMS, or fallback if none active
  const activeSlides =
    heroSlides && heroSlides.filter((s) => s.active).length > 0
      ? heroSlides.filter((s) => s.active)
      : DEFAULT_HERO_SLIDES;

  // Advance to next slide in circular sequence
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  // Return to previous slide
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Reset currentSlide if out of bounds after slide count change
  useEffect(() => {
    if (currentSlide >= activeSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  // Auto-play interval timer with hover pause
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, activeSlides.length]);

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
        {/* Compact, Proportionate Hero Slider */}
        <div
          className="relative w-full h-[290px] sm:h-[330px] md:h-[360px] lg:h-[390px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-zinc-200/80 dark:border-zinc-800/90 group bg-zinc-100 dark:bg-zinc-900 isolate"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel slides with cross-fade transition */}
          {activeSlides.map((slide, index) => {
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
                  alt={slide.alt || slide.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-102"
                />

                {/* Multi-layered gradient scrim for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 pointer-events-none" />

                {/* Bottom Text Content & Action Block */}
                <div className="absolute bottom-11 sm:bottom-6 md:bottom-7 left-4 right-4 sm:left-8 sm:right-8 z-20 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
                  <div className="max-w-xl">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white/90 drop-shadow-sm block mb-1 sm:mb-1.5">
                      {slide.badge || "Inspire Lifestyle"}
                    </span>
                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                      {slide.title}
                    </h1>
                    {slide.description && (
                      <p className="text-xs sm:text-sm text-white/80 line-clamp-1 sm:line-clamp-2 mt-1 drop-shadow-sm">
                        {slide.description}
                      </p>
                    )}
                  </div>

                  <Link
                    href={slide.href}
                    className="self-start sm:self-auto inline-flex items-center gap-2 px-4.5 py-2 sm:px-6 sm:py-3 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Previous and Next Navigation Arrows */}
          {activeSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous banner slide"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner slide"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Slider Pagination Indicator Dots */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {activeSlides.map((slide, idx) => (
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
          )}
        </div>
      </div>
    </section>
  );
};
