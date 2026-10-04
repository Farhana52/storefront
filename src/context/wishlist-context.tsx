"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import { Product } from "@/types";

interface WishlistContextType {
  items: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_STORAGE_KEY = "aura_wishlist";

let cachedRaw: string | null = null;
let cachedList: Product[] = [];

// Subscribe to storage changes across windows and custom app updates
function subscribeWishlist(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("wishlist_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("wishlist_change", callback);
  };
}

function getWishlistSnapshot(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedList = raw ? JSON.parse(raw) : [];
    }
    return cachedList;
  } catch {
    return cachedList;
  }
}

const emptyList: Product[] = [];
function getServerSnapshot(): Product[] {
  return emptyList;
}

import { pushWishlistSync } from "@/services/store-sync";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const items = useSyncExternalStore(subscribeWishlist, getWishlistSnapshot, getServerSnapshot);

  const saveItems = useCallback((newItems: Product[]) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Storage quota or restriction fallback
    }
    cachedRaw = null;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("wishlist_change"));
    }
    pushWishlistSync(newItems);
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const addToWishlist = useCallback(
    (product: Product) => {
      const current = getWishlistSnapshot();
      if (!current.some((i) => i.id === product.id)) {
        saveItems([...current, product]);
      }
    },
    [saveItems]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      const current = getWishlistSnapshot();
      saveItems(current.filter((item) => item.id !== productId));
    },
    [saveItems]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      const current = getWishlistSnapshot();
      if (current.some((item) => item.id === product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [removeFromWishlist, addToWishlist]
  );

  const clearWishlist = useCallback(() => {
    saveItems([]);
  }, [saveItems]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlistItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
