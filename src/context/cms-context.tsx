"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

  // Reload from database
  refreshDatabase: () => Promise<void>;
  // Reset
  resetToDefaults: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [announcement, setAnnouncement] = useState<AnnouncementConfig>(DEFAULT_ANNOUNCEMENT);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [coupons, setCoupons] = useState<CouponConfig[]>(DEFAULT_COUPONS);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [reviews, setReviews] = useState<ProductReview[]>(DEFAULT_REVIEWS);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(MOCK_CUSTOMERS);
  const [sizes, setSizes] = useState<VariationSize[]>(DEFAULT_SIZES);
  const [colors, setColors] = useState<VariationColor[]>(DEFAULT_COLORS);

  // Fetch real data from Neon PostgreSQL database on mount
  const refreshDatabase = useCallback(async () => {
    try {
      // 1. Fetch live products
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData.products) && prodData.products.length > 0) {
          setProducts(prodData.products);
        }
      }

      // 2. Fetch live categories
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      }

      // 3. Fetch live orders
      const orderRes = await fetch("/api/orders");
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (Array.isArray(orderData.orders) && orderData.orders.length > 0) {
          // Format into AdminOrder
          const formattedOrders: AdminOrder[] = orderData.orders.map((ord: {
            id: string;
            orderNumber: string;
            customerName: string;
            customerEmail: string | null;
            customerPhone: string;
            subtotal: number;
            deliveryFee: number;
            discount: number;
            totalAmount: number;
            paymentMethod: string;
            paymentStatus: string;
            orderStatus: string;
            createdAt: string;
            shippingAddress: string;
            shippingCity: string;
            courier: string;
            trackingCode?: string;
            estimatedDelivery?: string;
            notes?: string;
            timeline?: Array<{ title: string; time: string; done: boolean; note?: string }>;
            items: Array<{
              productId?: string;
              title: string;
              price: number;
              quantity: number;
              size?: string;
              color?: string;
              image?: string;
            }>;
            user?: {
              id: string;
              name: string;
              email: string;
              phone: string;
              avatar?: string;
              tier?: string;
            };
          }) => ({
            id: ord.id,
            customer: {
              id: ord.user?.id || ord.id,
              name: ord.user?.name || ord.customerName,
              email: ord.user?.email || ord.customerEmail || "",
              phone: ord.user?.phone || ord.customerPhone,
              avatar: ord.user?.avatar || "",
              tier: (ord.user?.tier as AdminOrder["customer"]["tier"]) || "VIP Patron",
            },
            items: (ord.items || []).map((it) => ({
              productId: it.productId || "prod-item",
              title: it.title,
              image: it.image || "",
              category: "Fashion",
              price: it.price,
              quantity: it.quantity,
              size: it.size || undefined,
              color: it.color || undefined,
            })),
            subtotal: ord.subtotal,
            deliveryFee: ord.deliveryFee,
            discount: ord.discount,
            totalAmount: ord.totalAmount,
            paymentMethod: ord.paymentMethod as AdminOrder["paymentMethod"],
            paymentStatus: ord.paymentStatus as AdminOrder["paymentStatus"],
            orderStatus: ord.orderStatus as AdminOrder["orderStatus"],
            createdAt: ord.createdAt,
            shippingAddress: ord.shippingAddress,
            shippingCity: ord.shippingCity,
            courier: ord.courier,
            trackingCode: ord.trackingCode,
            estimatedDelivery: ord.estimatedDelivery,
            timeline: Array.isArray(ord.timeline) ? ord.timeline : [],
            notes: ord.notes || undefined,
          }));
          setOrders(formattedOrders);
        }
      }

      // 4. Fetch live coupons
      const couponRes = await fetch("/api/coupons");
      if (couponRes.ok) {
        const couponData = await couponRes.json();
        if (Array.isArray(couponData.coupons) && couponData.coupons.length > 0) {
          setCoupons(
            couponData.coupons.map((c: {
              id: string;
              code: string;
              discount: string;
              minSpend?: string;
              description?: string;
              active: boolean;
            }) => ({
              id: c.id,
              code: c.code,
              discountPercent: parseInt(c.discount.replace(/[^0-9]/g, "")) || 10,
              description: c.description || "",
              active: c.active,
              minSpend: parseInt(c.minSpend?.replace(/[^0-9]/g, "") || "0"),
            }))
          );
        }
      }

      // 5. Fetch CMS store settings
      const cmsRes = await fetch("/api/cms");
      if (cmsRes.ok) {
        const cmsData = await cmsRes.json();
        if (Array.isArray(cmsData.heroSlides) && cmsData.heroSlides.length > 0) {
          setHeroSlides(cmsData.heroSlides);
        }
        if (cmsData.announcement && cmsData.announcement.text) {
          setAnnouncement(cmsData.announcement);
        }
        if (cmsData.footerConfig && cmsData.footerConfig.brandName) {
          setFooterConfig(cmsData.footerConfig);
        }
        if (Array.isArray(cmsData.sizes) && cmsData.sizes.length > 0) {
          setSizes(cmsData.sizes);
        }
        if (Array.isArray(cmsData.colors) && cmsData.colors.length > 0) {
          setColors(cmsData.colors);
        }
      }
    } catch (e) {
      console.error("Failed to load initial data from Neon PostgreSQL:", e);
    }
  }, []);

  useEffect(() => {
    refreshDatabase();
  }, [refreshDatabase]);

  // Sync CMS block changes to Neon DB
  const syncCMSToDatabase = async (payload: {
    heroSlides?: HeroSlide[];
    announcement?: AnnouncementConfig;
    footerConfig?: FooterConfig;
    sizes?: VariationSize[];
    colors?: VariationColor[];
  }) => {
    try {
      await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Graceful error handling
    }
  };

  // Hero Slides
  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) => {
    const updated = heroSlides.map((slide) =>
      slide.id === id ? { ...slide, ...updates } : slide
    );
    setHeroSlides(updated);
    syncCMSToDatabase({ heroSlides: updated });
  };

  const addHeroSlide = (slide: Omit<HeroSlide, "id">) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
    };
    const updated = [...heroSlides, newSlide];
    setHeroSlides(updated);
    syncCMSToDatabase({ heroSlides: updated });
  };

  const deleteHeroSlide = (id: string) => {
    const updated = heroSlides.filter((slide) => slide.id !== id);
    setHeroSlides(updated);
    syncCMSToDatabase({ heroSlides: updated });
  };

  // Announcement
  const updateAnnouncement = (updates: Partial<AnnouncementConfig>) => {
    const updated = { ...announcement, ...updates };
    setAnnouncement(updated);
    syncCMSToDatabase({ announcement: updated });
  };

  // Footer
  const updateFooter = (updates: Partial<FooterConfig>) => {
    const updated = { ...footerConfig, ...updates };
    setFooterConfig(updated);
    syncCMSToDatabase({ footerConfig: updated });
  };

  // Coupons
  const addCoupon = async (coupon: Omit<CouponConfig, "id">) => {
    const newCoupon: CouponConfig = {
      ...coupon,
      id: `coupon-${Date.now()}`,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          code: coupon.code,
          discount: `${coupon.discountPercent}% OFF`,
          minSpend: coupon.minSpend ? `Min. spend ৳${coupon.minSpend}` : undefined,
          description: coupon.description,
          active: coupon.active,
        }),
      });
    } catch {
      // Fallback
    }
  };

  const toggleCoupon = async (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id }),
      });
    } catch {
      // Fallback
    }
  };

  const deleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
    } catch {
      // Fallback
    }
  };

  // Categories
  const addCategory = async (category: CategoryItem) => {
    setCategories((prev) => [...prev, category]);
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
    } catch {
      // Fallback
    }
  };

  const updateCategory = async (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch {
      // Fallback
    }
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
  const addProduct = async (prod: Product) => {
    setProducts((prev) => [prod, ...prev]);
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod),
      });
    } catch {
      // Fallback
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch {
      // Fallback
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    } catch {
      // Fallback
    }
  };

  // Orders
  const addOrder = async (newOrder: AdminOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
    } catch {
      // Fallback
    }
  };

  const updateOrderStatus = async (orderId: string, status: AdminOrderStatus) => {
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
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
    } catch {
      // Fallback
    }
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
    const updated = [...sizes, size];
    setSizes(updated);
    syncCMSToDatabase({ sizes: updated });
  };

  const updateSize = (id: string, updates: Partial<VariationSize>) => {
    const updated = sizes.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSizes(updated);
    syncCMSToDatabase({ sizes: updated });
  };

  const deleteSize = (id: string) => {
    const updated = sizes.filter((s) => s.id !== id);
    setSizes(updated);
    syncCMSToDatabase({ sizes: updated });
  };

  const addColor = (color: VariationColor) => {
    const updated = [...colors, color];
    setColors(updated);
    syncCMSToDatabase({ colors: updated });
  };

  const updateColor = (id: string, updates: Partial<VariationColor>) => {
    const updated = colors.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setColors(updated);
    syncCMSToDatabase({ colors: updated });
  };

  const deleteColor = (id: string) => {
    const updated = colors.filter((c) => c.id !== id);
    setColors(updated);
    syncCMSToDatabase({ colors: updated });
  };

  // Reset
  const resetToDefaults = () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setAnnouncement(DEFAULT_ANNOUNCEMENT);
    setFooterConfig(DEFAULT_FOOTER_CONFIG);
    setCoupons(DEFAULT_COUPONS);
    setCategories(DEFAULT_CATEGORIES);
    setReviews(DEFAULT_REVIEWS);
    setSizes(DEFAULT_SIZES);
    setColors(DEFAULT_COLORS);
    refreshDatabase();
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
        refreshDatabase,
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
