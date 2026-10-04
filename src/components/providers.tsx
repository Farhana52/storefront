"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "@/context/theme-context";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { SearchProvider } from "@/context/search-context";
import { pullSync } from "@/services/store-sync";

import { AuthProvider } from "@/context/auth-context";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initial sync check on page mount
    pullSync();

    // Gentle polling to receive live updates from other devices (e.g. mobile <-> laptop)
    const interval = setInterval(pullSync, 2000);

    // Sync immediately when device window becomes active or tab gains focus
    const handleActive = () => pullSync();
    window.addEventListener("focus", handleActive);
    document.addEventListener("visibilitychange", handleActive);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleActive);
      document.removeEventListener("visibilitychange", handleActive);
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
