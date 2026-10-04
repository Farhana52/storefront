"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCMS } from "@/context/cms-context";
import {
  Search,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Palette,
  Truck,
  Layers,
  MessageSquare,
  SlidersHorizontal,
  LayoutTemplate,
  TicketPercent,
  Plus,
  ExternalLink,
  ArrowRight,
  X,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Pages" | "Products" | "Orders" | "Variations" | "Actions";
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  thumbnail?: string;
  swatchHex?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const cms = useCMS();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global static pages and quick actions
  const defaultItems: CommandItem[] = useMemo(
    () => [
      {
        id: "page-dashboard",
        title: "Dashboard",
        subtitle: "Executive KPIs, revenue metrics & atelier overview",
        category: "Pages",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        id: "page-products",
        title: "Products Catalog",
        subtitle: "Manage catalog items, pricing, inventory & tags",
        category: "Pages",
        href: "/admin/products",
        icon: Package,
      },
      {
        id: "page-sizes",
        title: "Size Variations",
        subtitle: "Sizing standards, dimensions & garment fit",
        category: "Variations",
        href: "/admin/products/sizes",
        icon: Palette,
        badge: `${cms.sizes.length} sizes`,
      },
      {
        id: "page-colors",
        title: "Color Shades",
        subtitle: "Textile colorways, CSS hex codes & palette swatches",
        category: "Variations",
        href: "/admin/products/colors",
        icon: Palette,
        badge: `${cms.colors.length} shades`,
      },
      {
        id: "page-orders",
        title: "Orders & Fulfillment",
        subtitle: "Customer purchases, payment statuses & fulfillment tracking",
        category: "Pages",
        href: "/admin/orders",
        icon: ShoppingBag,
        badge: `${cms.orders.length} orders`,
      },
      {
        id: "page-customers",
        title: "Customers & Patrons",
        subtitle: "VIP patrons, gold members & buyer profiles",
        category: "Pages",
        href: "/admin/customers",
        icon: Users,
      },
      {
        id: "page-categories",
        title: "Categories",
        subtitle: "Product taxonomy, collections & tags",
        category: "Pages",
        href: "/admin/categories",
        icon: Layers,
      },
      {
        id: "page-shipping",
        title: "Shipping & Courier Logistics",
        subtitle: "Steadfast, Pathao, RedX consignments & tracking",
        category: "Pages",
        href: "/admin/shipping",
        icon: Truck,
      },
      {
        id: "page-slider",
        title: "Hero Slides",
        subtitle: "Storefront carousel banners & seasonal promotions",
        category: "Pages",
        href: "/admin/slider",
        icon: SlidersHorizontal,
      },
      {
        id: "page-content",
        title: "Storefront Content",
        subtitle: "Announcement banner, contact hotline & brand footer",
        category: "Pages",
        href: "/admin/content",
        icon: LayoutTemplate,
      },
      {
        id: "page-coupons",
        title: "Promotional Coupons",
        subtitle: "Discount campaigns, percentage vouchers & rules",
        category: "Pages",
        href: "/admin/coupons",
        icon: TicketPercent,
      },
      {
        id: "page-reviews",
        title: "Customer Reviews",
        subtitle: "Ratings moderation & verified buyer feedback",
        category: "Pages",
        href: "/admin/reviews",
        icon: MessageSquare,
      },
      {
        id: "action-new-product",
        title: "Add New Product",
        subtitle: "Create a new garment silhouette for the catalog",
        category: "Actions",
        href: "/admin/products/new",
        icon: Plus,
      },
      {
        id: "action-view-storefront",
        title: "Open Live Storefront",
        subtitle: "View customer-facing homepage in new tab",
        category: "Actions",
        href: "/",
        icon: ExternalLink,
      },
    ],
    [cms.sizes.length, cms.colors.length, cms.orders.length]
  );

  // Dynamic search results across CMS entities
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return defaultItems;
    }

    const results: CommandItem[] = [];

    // 1. Matching pages & actions
    defaultItems.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
      ) {
        results.push(item);
      }
    });

    // 2. Matching Products
    cms.products.forEach((prod) => {
      if (
        prod.title.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q) ||
        (prod.tag && prod.tag.toLowerCase().includes(q))
      ) {
        results.push({
          id: `prod-${prod.id}`,
          title: prod.title,
          subtitle: `৳${prod.price.toLocaleString()} • ${prod.category}`,
          category: "Products",
          href: `/admin/products/${prod.id}`,
          thumbnail: prod.image,
          badge: prod.inStock ? "In Stock" : "Sold Out",
        });
      }
    });

    // 3. Matching Orders
    cms.orders.forEach((order) => {
      const cust = order.customer;
      if (
        order.id.toLowerCase().includes(q) ||
        (cust?.name && cust.name.toLowerCase().includes(q)) ||
        (cust?.email && cust.email.toLowerCase().includes(q)) ||
        (cust?.phone && cust.phone.includes(q))
      ) {
        results.push({
          id: `order-${order.id}`,
          title: `Order #${order.id}${cust?.name ? ` — ${cust.name}` : ""}`,
          subtitle: `৳${order.totalAmount.toLocaleString()} • ${order.paymentMethod}`,
          category: "Orders",
          href: `/admin/orders/${order.id}`,
          icon: ShoppingBag,
          badge: order.orderStatus,
        });
      }
    });

    // 4. Matching Variation Sizes
    cms.sizes.forEach((s) => {
      if (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
      ) {
        results.push({
          id: `size-${s.id}`,
          title: `Size: ${s.name} (${s.code})`,
          subtitle: s.description || "Standard atelier sizing",
          category: "Variations",
          href: "/admin/products/sizes",
          icon: Palette,
          badge: s.active ? "Active" : "Inactive",
        });
      }
    });

    // 5. Matching Variation Colors
    cms.colors.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      ) {
        results.push({
          id: `color-${c.id}`,
          title: `Color: ${c.name}`,
          subtitle: `${c.hex}${c.description ? ` • ${c.description}` : ""}`,
          category: "Variations",
          href: "/admin/products/colors",
          icon: Palette,
          swatchHex: c.hex,
          badge: c.active ? "Active" : "Inactive",
        });
      }
    });

    return results.slice(0, 16);
  }, [query, defaultItems, cms.products, cms.orders, cms.sizes, cms.colors]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        onClose();
        router.push(current.href);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-index="${selectedIndex}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command search palette"
    >
      <div
        className="w-full max-w-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 select-none"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search products, orders, variations..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none"
            aria-autocomplete="list"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md cursor-pointer mr-1.5"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shrink-0">
            esc
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-96 overflow-y-auto p-2 divide-y divide-transparent"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Try searching for product names, order IDs, sizes, or pages.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = selectedIndex === index;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={() => {
                    onClose();
                    router.push(item.href);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-100 ${
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Visual Indicator */}
                    {item.thumbnail ? (
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : item.swatchHex ? (
                      <div
                        className="w-7 h-7 rounded-lg shrink-0 border border-zinc-300 dark:border-zinc-700 shadow-2xs"
                        style={{ backgroundColor: item.swatchHex }}
                      />
                    ) : Icon ? (
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-white/10 dark:bg-zinc-900/10 text-white dark:text-zinc-900"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    ) : null}

                    {/* Text Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected
                              ? "text-white/80 dark:text-zinc-900/80"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Badge or Return Indicator */}
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Apple-style Keyboard Navigation Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-950/80 border-t border-zinc-200/80 dark:border-zinc-800/80 text-[11px] text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px]">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px]">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>

          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px]">
              esc
            </kbd>
            <span>to close</span>
          </span>
        </div>
      </div>
    </div>
  );
};
