"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/navbar/brand-logo";
import { NavLinks } from "@/components/navbar/nav-links";
import { MobileMenu } from "@/components/navbar/mobile-menu";
import { NavbarSearch } from "@/components/navbar/navbar-search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ShoppingBagIcon, UserIcon, HeartIcon } from "@/components/ui/icons";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  // Track scroll position to enhance backdrop blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 w-full transition-all duration-300">
        {/* Main navigation bar */}
        <div
          className={`w-full transition-all duration-300 border-b ${
            isScrolled
              ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
              : "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-zinc-200/50 dark:border-zinc-800/50"
          }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Name */}
          <div className="flex items-center">
            <BrandLogo />
          </div>

          {/* Center: Desktop Navigation Links */}
          <NavLinks />

          {/* Search Bar in Navbar (Desktop: in that empty space) */}
          <div className="hidden md:block flex-1 max-w-[200px] lg:max-w-[260px] xl:max-w-[300px] mx-2 lg:mx-4">
            <NavbarSearch />
          </div>

          {/* Right: Actions (Wishlist, Theme Toggle, Cart Icon, Sign In Button, Mobile Hamburger) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile Search Button */}
            <div className="md:hidden">
              <NavbarSearch isMobile />
            </div>

            {/* Wishlist Link with Counter Badge */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist with ${totalWishlistItems} saved pieces`}
              className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <HeartIcon
                size={20}
                filled={totalWishlistItems > 0}
                className={totalWishlistItems > 0 ? "text-rose-500 fill-rose-500" : ""}
              />
              {totalWishlistItems > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-xs transform transition-transform group-hover:scale-110">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Cart Icon with Item Counter Badge */}
            <button
              type="button"
              onClick={toggleCart}
              aria-label={`Shopping bag with ${totalItems} items`}
              className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <ShoppingBagIcon size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-zinc-950 dark:bg-white dark:text-zinc-950 rounded-full shadow-xs transform transition-transform group-hover:scale-110">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile / Sign In Button (Desktop) */}
            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                </span>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  className="px-2 py-1 text-xs font-medium text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 shadow-xs hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <UserIcon size={14} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              {/* Three-line animated hamburger icon */}
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-current rounded-full transition-all duration-300" />
                <span className="w-3/4 h-0.5 bg-current rounded-full transition-all duration-300 ml-auto" />
                <span className="w-full h-0.5 bg-current rounded-full transition-all duration-300" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer Sheet */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>

    {/* Spacer matching exact fixed header height to prevent content jump */}
    <div className="h-16 sm:h-18 w-full shrink-0" aria-hidden="true" />
  </>
);
};
