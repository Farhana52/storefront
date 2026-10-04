"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { SearchIcon, CloseIcon } from "@/components/ui/icons";

interface NavbarSearchProps {
  isMobile?: boolean;
}

export const NavbarSearch: React.FC<NavbarSearchProps> = ({ isMobile = false }) => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter products based on search query
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_PRODUCTS.filter(
      (product) =>
        product.title.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.subtitle.toLowerCase().includes(q) ||
        (product.tag && product.tag.toLowerCase().includes(q))
    );
  }, [query]);

  // Navigate to first result on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0) {
      setIsDropdownOpen(false);
      setIsMobileSearchOpen(false);
      setQuery("");
      router.push(`/shop/${results[0].id}`);
    }
  };

  // Mobile trigger button when isMobile is true
  if (isMobile) {
    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => {
            setIsMobileSearchOpen((prev) => !prev);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          aria-label="Search"
          className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
        >
          <SearchIcon size={20} />
        </button>

        {isMobileSearchOpen && (
          <div className="fixed inset-x-4 top-18 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-fadeIn">
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                style={{ outline: "none", boxShadow: "none" }}
                className="w-full h-9 pl-3 pr-8 text-xs rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 !outline-none !ring-0 focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 transition-colors"
              />
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                aria-label="Close search"
                className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {query.trim().length > 0 && (
              <div className="mt-2 max-h-[300px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
                {results.length > 0 ? (
                  results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.id}`}
                      onClick={() => {
                        setIsMobileSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded border border-zinc-200 dark:border-zinc-700 p-0.5 shrink-0 overflow-hidden bg-white dark:bg-zinc-800">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="40px"
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {product.title}
                        </p>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">
                          ৳{product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="py-4 text-center text-xs text-zinc-400">
                    No products found for &ldquo;{query}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop inline navbar search bar
  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Permanent Search Bar in Navbar */}
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          style={{ outline: "none", boxShadow: "none" }}
          className="w-full h-9 pl-3.5 pr-8 text-xs sm:text-[13px] rounded-full bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border border-zinc-200/90 dark:border-zinc-700/60 focus:border-zinc-400 dark:focus:border-zinc-500 focus:bg-white dark:focus:bg-zinc-900 !outline-none !ring-0 focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 transition-colors"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
            >
              <CloseIcon size={12} />
            </button>
          )}
          <span className="text-zinc-400 dark:text-zinc-500 pointer-events-none">
            <SearchIcon size={15} />
          </span>
        </div>
      </div>

      {/* Autocomplete Dropdown directly under the navbar search bar */}
      {isDropdownOpen && query.trim().length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-full min-w-[340px] lg:min-w-[380px] bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200/90 dark:border-zinc-800 z-50 overflow-hidden animate-fadeIn">
          <div className="max-h-[380px] overflow-y-auto no-scrollbar divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {results.length > 0 ? (
              results.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3.5 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group"
                >
                  {/* Square Product Image with Border */}
                  <div className="relative w-12 h-12 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 p-0.5 shrink-0 bg-white dark:bg-zinc-800 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="48px"
                      className="object-cover rounded group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details (Clean monochrome luxury colors) */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {product.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[11px] text-zinc-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block truncate mt-0.5">
                      {product.category}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-6 text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                No products found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
