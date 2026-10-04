"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useSyncExternalStore,
  useCallback,
} from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    options?: {
      quantity?: number;
      selectedSize?: string;
      selectedColor?: string;
      openDrawer?: boolean;
    }
  ) => void;
  removeItem: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (
    productId: string,
    delta: number,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "aura_cart";

let cachedRaw: string | null = null;
let cachedList: CartItem[] = [];

// Subscribe to storage changes across windows and custom app updates
function subscribeCart(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("cart_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cart_change", callback);
  };
}

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const parsed = raw ? JSON.parse(raw) : [];
      cachedList = Array.isArray(parsed) ? parsed : [];
    }
    return cachedList;
  } catch {
    return cachedList;
  }
}

const emptyList: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return emptyList;
}

import { pushCartSync } from "@/services/store-sync";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const saveItems = useCallback((newItems: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Storage quota or restriction fallback
    }
    cachedRaw = null;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cart_change"));
    }
    pushCartSync(newItems);
  }, []);

  const addItem = (
    product: Product,
    options?: {
      quantity?: number;
      selectedSize?: string;
      selectedColor?: string;
      openDrawer?: boolean;
    }
  ) => {
    const current = getCartSnapshot();
    const qty = options?.quantity ?? 1;
    const size = options?.selectedSize ?? "M";
    const color = options?.selectedColor ?? "Obsidian";

    let nextItems: CartItem[];
    const existing = current.find(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );
    if (existing) {
      nextItems = current.map((item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity: item.quantity + qty }
          : item
      );
    } else {
      nextItems = [
        ...current,
        { product, quantity: qty, selectedSize: size, selectedColor: color },
      ];
    }

    saveItems(nextItems);

    if (options?.openDrawer) {
      setIsOpen(true);
    }
  };

  const removeItem = (productId: string, selectedSize?: string, selectedColor?: string) => {
    const current = getCartSnapshot();
    const nextItems = current.filter((item) => {
      if (item.product.id !== productId) return true;
      if (selectedSize && item.selectedSize !== selectedSize) return true;
      if (selectedColor && item.selectedColor !== selectedColor) return true;
      return false;
    });
    saveItems(nextItems);
  };

  const updateQuantity = (
    productId: string,
    delta: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    const current = getCartSnapshot();
    let updated = false;
    const nextItems: CartItem[] = [];
    for (const item of current) {
      const matches =
        item.product.id === productId &&
        (!selectedSize || item.selectedSize === selectedSize) &&
        (!selectedColor || item.selectedColor === selectedColor);
      if (matches && !updated) {
        const newQty = item.quantity + delta;
        if (newQty > 0) {
          nextItems.push({ ...item, quantity: newQty });
        }
        updated = true;
      } else {
        nextItems.push(item);
      }
    }
    saveItems(nextItems);
  };

  const getItemQuantity = (productId: string): number => {
    return items
      .filter((item) => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    saveItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        getItemQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
