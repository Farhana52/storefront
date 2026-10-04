"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash) {
        window.history.pushState(null, "", "/");
      }
    }
  };

  return (
    <Link
      href="/"
      scroll={true}
      onClick={handleClick}
      className={`group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-sm cursor-pointer ${className}`}
      aria-label="Inspire Lifestyle Homepage"
    >
      {/* Bespoke Inspire Lifestyle Crowned Monogram Emblem */}
      <div className="relative w-8.5 h-8.5 rounded-[10px] bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 shadow-sm border border-zinc-900/10 dark:border-white/10 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="w-4.5 h-4.5 fill-none stroke-current"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Inspiration Diamond Star Crown atop "I" */}
          <path
            d="M8 2L8.8 3.5L10.3 4.2L8.8 4.9L8 6.4L7.2 4.9L5.7 4.2L7.2 3.5Z"
            fill="currentColor"
            stroke="none"
          />

          {/* Haute Couture "I" (Inspire) */}
          <line x1="8" y1="7.5" x2="8" y2="19.5" strokeWidth="2.2" />
          <line x1="5.5" y1="7.5" x2="10.5" y2="7.5" strokeWidth="1.8" />
          <line x1="5.5" y1="19.5" x2="10.5" y2="19.5" strokeWidth="1.8" />

          {/* Architectural "L" (Lifestyle) */}
          <path d="M14 6.5V19.5H19" strokeWidth="2.2" />
          <line x1="12" y1="6.5" x2="16" y2="6.5" strokeWidth="1.8" />
        </svg>
      </div>

      {/* Brand typographic lockup */}
      <div className="flex flex-col">
        <span className="font-bold text-sm sm:text-base tracking-[0.18em] text-zinc-950 dark:text-white uppercase transition-colors leading-none">
          INSPIRE
        </span>
        <span className="text-[8.5px] sm:text-[9px] font-semibold tracking-[0.26em] text-zinc-500 dark:text-zinc-400 uppercase mt-0.5 leading-none">
          LIFESTYLE
        </span>
      </div>
    </Link>
  );
};
