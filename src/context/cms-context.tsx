"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HeroSlide,
  AnnouncementConfig,
  FooterConfig,
  CouponConfig,
  CategoryItem,
  ProductReview,
  VariationSize,
  VariationColor,
} from "@/types/cms";
import { Product } from "@/types";
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_ANNOUNCEMENT,
  DEFAULT_FOOTER_CONFIG,
  DEFAULT_COUPONS,
  DEFAULT_CATEGORIES,
  DEFAULT_REVIEWS,
  DEFAULT_SIZES,
  DEFAULT_COLORS,
} from "@/data/cms-defaults";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import {
  MOCK_ORDERS,
  MOCK_CUSTOMERS,
  AdminOrder,
  AdminCustomer,
  AdminOrderStatus,
} from "@/data/admin-data";

interface CMSContextType {
  // Storefront CMS
  heroSlides: HeroSlide[];
  announcement: AnnouncementConfig;
  footerConfig: FooterConfig;
  coupons: CouponConfig[];
  categories: CategoryItem[];
  reviews: ProductReview[];
  products: Product[];
  orders: AdminOrder[];
  customers: AdminCustomer[];

  // Slides CRUD
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: Omit<HeroSlide, "id">) => void;
  deleteHeroSlide: (id: string) => void;

  // Site & Footer
  updateAnnouncement: (updates: Partial<AnnouncementConfig>) => void;
  updateFooter: (updates: Partial<FooterConfig>) => void;

  // Coupons
  addCoupon: (coupon: Omit<CouponConfig, "id">) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;

  // Categories
  addCategory: (category: CategoryItem) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;

  // Reviews
  addReview: (review: Omit<ProductReview, "id" | "createdAt">) => void;
  updateReviewStatus: (id: string, status: "approved" | "pending" | "hidden") => void;
  deleteReview: (id: string) => void;

  // Products
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  addOrder: (order: AdminOrder) => void;
  updateOrderStatus: (orderId: string, status: AdminOrderStatus) => void;

  // Customers
  addCustomer: (customer: AdminCustomer) => void;
  updateCustomer: (id: string, updates: Partial<AdminCustomer>) => void;
  deleteCustomer: (id: string) => void;

  // Variations (Sizes & Colors)
  sizes: VariationSize[];
  colors: VariationColor[];
  addSize: (size: VariationSize) => void;
  updateSize: (id: string, updates: Partial<VariationSize>) => void;
  deleteSize: (id: string) => void;
  addColor: (color: VariationColor) => void;
  updateColor: (id: string, updates: Partial<VariationColor>) => void;
  deleteColor: (id: string) => void;

  // Reset
  resetToDefaults: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const CMS_STORAGE_KEY = "inspire_cms_store_v3";

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [announcement, setAnnouncement] = useState<AnnouncementConfig>(DEFAULT_ANNOUNCEMENT);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [coupons, setCoupons] = useState<CouponConfig[]>(DEFAULT_COUPONS);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [reviews, setReviews] = useState<ProductReview[]>(DEFAULT_REVIEWS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(MOCK_CUSTOMERS);
  const [sizes, setSizes] = useState<VariationSize[]>(DEFAULT_SIZES);
  const [colors, setColors] = useState<VariationColor[]>(DEFAULT_COLORS);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.heroSlides) setHeroSlides(parsed.heroSlides);
        if (parsed.announcement) setAnnouncement(parsed.announcement);
        if (parsed.footerConfig) setFooterConfig(parsed.footerConfig);
        if (parsed.coupons) setCoupons(parsed.coupons);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.reviews) setReviews(parsed.reviews);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.sizes) setSizes(parsed.sizes);
        if (parsed.colors) setColors(parsed.colors);
      }
    } catch {
      // Fallback to defaults on parse error
    }
    setMounted(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        CMS_STORAGE_KEY,
        JSON.stringify({
          heroSlides,
          announcement,
          footerConfig,
          coupons,
          categories,
          reviews,
          products,
          orders,
          customers,
          sizes,
          colors,
        })
      );
    } catch {
      // Storage quota or error safe guard
    }
  }, [
    heroSlides,
    announcement,
    footerConfig,
    coupons,
    categories,
    reviews,
    products,
    orders,
    customers,
    sizes,
    colors,
    mounted,
  ]);

  // Hero Slides
  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) => {
    setHeroSlides((prev) =>
      prev.map((slide) => (slide.id === id ? { ...slide, ...updates } : slide))
    );
  };

  const addHeroSlide = (slide: Omit<HeroSlide, "id">) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
    };
    setHeroSlides((prev) => [...prev, newSlide]);
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((slide) => slide.id !== id));
  };

  // Announcement
  const updateAnnouncement = (updates: Partial<AnnouncementConfig>) => {
    setAnnouncement((prev) => ({ ...prev, ...updates }));
  };

  // Footer
  const updateFooter = (updates: Partial<FooterConfig>) => {
    setFooterConfig((prev) => ({ ...prev, ...updates }));
  };

  // Coupons
  const addCoupon = (coupon: Omit<CouponConfig, "id">) => {
    const newCoupon: CouponConfig = {
      ...coupon,
      id: `coupon-${Date.now()}`,
    };
    setCoupons((prev) => [...prev, newCoupon]);
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // Categories
  const addCategory = (category: CategoryItem) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // Reviews
  const addReview = (review: Omit<ProductReview, "id" | "createdAt">) => {
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const updateReviewStatus = (
    id: string,
    status: "approved" | "pending" | "hidden"
  ) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Products
  const addProduct = (prod: Product) => {
    setProducts((prev) => [prod, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Orders
  const addOrder = (newOrder: AdminOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: AdminOrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [...ord.timeline];
          if (status === "delivered") {
            updatedTimeline.push({
              title: "Delivered",
              time: "Just now",
              done: true,
            });
          }
          return {
            ...ord,
            orderStatus: status,
            paymentStatus:
              status === "delivered" && ord.paymentMethod === "cod"
                ? "paid"
                : ord.paymentStatus,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
  };

  // Customers
  const addCustomer = (customer: AdminCustomer) => {
    setCustomers((prev) => [customer, ...prev]);
  };

  const updateCustomer = (id: string, updates: Partial<AdminCustomer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Variations (Sizes & Colors) CRUD
  const addSize = (size: VariationSize) => {
    setSizes((prev) => [...prev, size]);
  };

  const updateSize = (id: string, updates: Partial<VariationSize>) => {
    setSizes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteSize = (id: string) => {
    setSizes((prev) => prev.filter((s) => s.id !== id));
  };

  const addColor = (color: VariationColor) => {
    setColors((prev) => [...prev, color]);
  };

  const updateColor = (id: string, updates: Partial<VariationColor>) => {
    setColors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteColor = (id: string) => {
    setColors((prev) => prev.filter((c) => c.id !== id));
  };

  // Reset
  const resetToDefaults = () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setAnnouncement(DEFAULT_ANNOUNCEMENT);
    setFooterConfig(DEFAULT_FOOTER_CONFIG);
    setCoupons(DEFAULT_COUPONS);
    setCategories(DEFAULT_CATEGORIES);
    setReviews(DEFAULT_REVIEWS);
    setProducts(MOCK_PRODUCTS);
    setOrders(MOCK_ORDERS);
    setCustomers(MOCK_CUSTOMERS);
    setSizes(DEFAULT_SIZES);
    setColors(DEFAULT_COLORS);
    localStorage.removeItem(CMS_STORAGE_KEY);
  };

  return (
    <CMSContext.Provider
      value={{
        heroSlides,
        announcement,
        footerConfig,
        coupons,
        categories,
        reviews,
        products,
        orders,
        customers,
        sizes,
        colors,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        updateAnnouncement,
        updateFooter,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        addCategory,
        updateCategory,
        deleteCategory,
        addReview,
        updateReviewStatus,
        deleteReview,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addSize,
        updateSize,
        deleteSize,
        addColor,
        updateColor,
        deleteColor,
        resetToDefaults,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};
