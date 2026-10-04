"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  SlidersHorizontal,
  LayoutTemplate,
  TicketPercent,
  BarChart3,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  X,
  Layers,
  MessageSquare,
  Truck,
  Send,
  Palette,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCMS } from "@/context/cms-context";

interface SubNavItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  subItems?: SubNavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  ordersCount?: number;
  productsCount?: number;
  categoriesCount?: number;
  customersCount?: number;
  reviewsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen,
  onCloseMobile,
  ordersCount,
  productsCount,
  categoriesCount,
  customersCount,
  reviewsCount,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cms = useCMS();

  // Dynamic counts
  const finalOrdersCount = ordersCount ?? cms.orders.length;
  const finalProductsCount = productsCount ?? cms.products.length;
  const finalCategoriesCount = categoriesCount ?? cms.categories.length;
  const finalCustomersCount = customersCount ?? cms.customers.length;
  const finalReviewsCount = reviewsCount ?? cms.reviews.length;

  const inStockProducts = cms.products.filter((p) => p.inStock).length;
  const outOfStockProducts = cms.products.length - inStockProducts;
  const cancelledOrders = cms.orders.filter((o) => o.orderStatus === "cancelled").length;
  const vipCustomers = cms.customers.filter(
    (c) => c.tier === "VIP Patron" || c.tier === "Gold Member"
  ).length;

  // Track expanded menu state
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    analytics: false,
    orders: false,
    inventory: false,
    variations: false,
    customers: false,
    shipping: false,
    communications: false,
  });

  // Auto-expand active route group
  useEffect(() => {
    if (pathname.startsWith("/admin/analytics")) {
      setExpandedMenus((prev) => ({ ...prev, analytics: true }));
    } else if (pathname.startsWith("/admin/orders")) {
      setExpandedMenus((prev) => ({ ...prev, orders: true }));
    } else if (
      pathname.startsWith("/admin/products/sizes") ||
      pathname.startsWith("/admin/products/colors") ||
      pathname.startsWith("/admin/variations")
    ) {
      setExpandedMenus((prev) => ({ ...prev, variations: true }));
    } else if (pathname.startsWith("/admin/products")) {
      setExpandedMenus((prev) => ({ ...prev, inventory: true }));
    } else if (pathname.startsWith("/admin/customers")) {
      setExpandedMenus((prev) => ({ ...prev, customers: true }));
    } else if (pathname.startsWith("/admin/shipping")) {
      setExpandedMenus((prev) => ({ ...prev, shipping: true }));
    } else if (pathname.startsWith("/admin/communications")) {
      setExpandedMenus((prev) => ({ ...prev, communications: true }));
    }
  }, [pathname]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentStatusParam = searchParams.get("status");
  const currentStockParam = searchParams.get("stock");
  const currentTierParam = searchParams.get("tier");

  const navGroups: NavGroup[] = [
    {
      title: "Main",
      items: [
        {
          id: "overview",
          label: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          id: "analytics",
          label: "Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
          subItems: [
            {
              id: "analytics-overview",
              label: "Overview",
              href: "/admin/analytics",
            },
            {
              id: "analytics-top-products",
              label: "Top products",
              href: "/admin/analytics/top-products",
              badge: "Ranked",
            },
          ],
        },
      ],
    },
    {
      title: "Commerce",
      items: [
        {
          id: "orders",
          label: "Orders",
          href: "/admin/orders",
          icon: ShoppingBag,
          badge: finalOrdersCount > 0 ? String(finalOrdersCount) : undefined,
          subItems: [
            {
              id: "all-orders",
              label: "All orders",
              href: "/admin/orders",
              badge: String(finalOrdersCount),
            },
            {
              id: "pending-orders",
              label: "Pending",
              href: "/admin/orders?status=pending",
              badge: String(cms.orders.filter((o) => o.orderStatus === "pending").length),
            },
            {
              id: "processing-orders",
              label: "Processing",
              href: "/admin/orders?status=processing",
              badge: String(cms.orders.filter((o) => o.orderStatus === "processing").length),
            },
            {
              id: "shipped-orders",
              label: "Shipped",
              href: "/admin/orders?status=shipped",
              badge: String(cms.orders.filter((o) => o.orderStatus === "shipped").length),
            },
            {
              id: "delivered-orders",
              label: "Delivered",
              href: "/admin/orders?status=delivered",
              badge: String(cms.orders.filter((o) => o.orderStatus === "delivered").length),
            },
            {
              id: "cancelled-orders",
              label: "Cancelled",
              href: "/admin/orders?status=cancelled",
              badge: cancelledOrders > 0 ? String(cancelledOrders) : undefined,
            },
          ],
        },
        {
          id: "inventory",
          label: "Products",
          href: "/admin/products",
          icon: Package,
          badge: finalProductsCount > 0 ? String(finalProductsCount) : undefined,
          subItems: [
            {
              id: "all-products",
              label: "All products",
              href: "/admin/products",
              badge: String(finalProductsCount),
            },
            {
              id: "new-product",
              label: "Add product",
              href: "/admin/products/new",
            },
            {
              id: "in-stock",
              label: "In stock",
              href: "/admin/products?stock=in",
              badge: String(inStockProducts),
            },
            {
              id: "sold-out",
              label: "Out of stock",
              href: "/admin/products?stock=out",
              badge: String(outOfStockProducts),
            },
          ],
        },
        {
          id: "variations",
          label: "Variations",
          href: "/admin/products/sizes",
          icon: Palette,
          badge: `${cms.sizes.length + cms.colors.length}`,
          subItems: [
            {
              id: "var-sizes",
              label: "Sizes",
              href: "/admin/products/sizes",
              badge: String(cms.sizes.length),
            },
            {
              id: "var-colors",
              label: "Color shades",
              href: "/admin/products/colors",
              badge: String(cms.colors.length),
            },
          ],
        },
        {
          id: "customers",
          label: "Customers",
          href: "/admin/customers",
          icon: Users,
          badge: finalCustomersCount > 0 ? String(finalCustomersCount) : undefined,
          subItems: [
            {
              id: "all-customers",
              label: "All customers",
              href: "/admin/customers",
              badge: String(finalCustomersCount),
            },
            {
              id: "vip-patrons",
              label: "VIP and gold",
              href: "/admin/customers?tier=vip",
              badge: String(vipCustomers),
            },
            {
              id: "first-time",
              label: "First-time",
              href: "/admin/customers?tier=first",
            },
            {
              id: "new-customer",
              label: "Add customer",
              href: "/admin/customers/new",
            },
          ],
        },
        {
          id: "shipping",
          label: "Shipping",
          href: "/admin/shipping",
          icon: Truck,
          subItems: [
            {
              id: "all-consignments",
              label: "Consignments",
              href: "/admin/shipping",
            },
            {
              id: "courier-apis",
              label: "Couriers",
              href: "/admin/shipping?tab=integrations",
            },
            {
              id: "shipping-zones",
              label: "Delivery zones",
              href: "/admin/shipping?tab=zones",
            },
          ],
        },
        {
          id: "categories",
          label: "Categories",
          href: "/admin/categories",
          icon: Layers,
          badge: finalCategoriesCount > 0 ? String(finalCategoriesCount) : undefined,
        },
      ],
    },
    {
      title: "Communications",
      items: [
        {
          id: "communications",
          label: "Communications",
          href: "/admin/communications",
          icon: Send,
          subItems: [
            {
              id: "sms-gateway",
              label: "SMS gateway",
              href: "/admin/communications?tab=sms",
            },
            {
              id: "email-gateway",
              label: "Email settings",
              href: "/admin/communications?tab=email",
            },
            {
              id: "otp-rules",
              label: "OTP rules",
              href: "/admin/communications?tab=otp",
            },
            {
              id: "comm-logs",
              label: "Delivery logs",
              href: "/admin/communications?tab=logs",
            },
          ],
        },
      ],
    },
    {
      title: "Storefront",
      items: [
        {
          id: "slider",
          label: "Hero slider",
          href: "/admin/slider",
          icon: SlidersHorizontal,
        },
        {
          id: "content",
          label: "Store content",
          href: "/admin/content",
          icon: LayoutTemplate,
        },
        {
          id: "coupons",
          label: "Coupons",
          href: "/admin/coupons",
          icon: TicketPercent,
        },
        {
          id: "reviews",
          label: "Reviews",
          href: "/admin/reviews",
          icon: MessageSquare,
          badge: finalReviewsCount > 0 ? String(finalReviewsCount) : undefined,
        },
      ],
    },
  ];

  const isMainActive = (item: NavItem) => {
    if (item.href === "/admin") {
      return pathname === "/admin";
    }
    if (item.id === "variations") {
      return (
        pathname.startsWith("/admin/products/sizes") ||
        pathname.startsWith("/admin/products/colors") ||
        pathname.startsWith("/admin/variations")
      );
    }
    if (item.id === "inventory") {
      if (
        pathname.startsWith("/admin/products/sizes") ||
        pathname.startsWith("/admin/products/colors")
      ) {
        return false;
      }
      return pathname.startsWith("/admin/products");
    }
    return pathname.startsWith(item.href);
  };

  const isSubActive = (sub: SubNavItem) => {
    if (sub.href.includes("?status=")) {
      const match = sub.href.match(/status=([^&]+)/);
      return (
        pathname.startsWith("/admin/orders") &&
        currentStatusParam === (match ? match[1] : null)
      );
    }
    if (sub.href.includes("?stock=")) {
      const match = sub.href.match(/stock=([^&]+)/);
      return (
        pathname.startsWith("/admin/products") &&
        currentStockParam === (match ? match[1] : null)
      );
    }
    if (sub.href.includes("?tier=")) {
      const match = sub.href.match(/tier=([^&]+)/);
      return (
        pathname.startsWith("/admin/customers") &&
        currentTierParam === (match ? match[1] : null)
      );
    }
    if (sub.href.includes("?tab=")) {
      const match = sub.href.match(/tab=([^&]+)/);
      const targetPath = sub.href.split("?")[0];
      return (
        pathname === targetPath &&
        searchParams.get("tab") === (match ? match[1] : null)
      );
    }
    if (sub.href === "/admin/analytics") {
      return pathname === "/admin/analytics";
    }
    if (sub.href === "/admin/analytics/top-products") {
      return pathname === "/admin/analytics/top-products";
    }
    if (sub.href === "/admin/shipping") {
      return pathname === "/admin/shipping" && !searchParams.get("tab");
    }
    if (sub.href === "/admin/communications") {
      return pathname === "/admin/communications" && !searchParams.get("tab");
    }
    if (sub.href === "/admin/products/sizes") {
      return pathname === "/admin/products/sizes";
    }
    if (sub.href === "/admin/products/colors") {
      return pathname === "/admin/products/colors";
    }
    return pathname === sub.href && !searchParams.toString();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200/80 dark:border-zinc-800/80 w-68 shrink-0 select-none">
      {/* Workspace Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 shrink-0">
        <Link
          href="/admin"
          className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-90 transition-opacity"
          onClick={onCloseMobile}
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs flex items-center justify-center shrink-0 tracking-tight shadow-2xs">
            IL
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
              Inspire Lifestyle
            </span>
            <span className="text-[11px] text-zinc-400 font-medium truncate">
              Admin Kit
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Groups - Properly Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {group.title}
            </p>

            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isMainActive(item);
              const hasSub = Boolean(item.subItems && item.subItems.length > 0);
              const isExpanded = expandedMenus[item.id] ?? false;

              return (
                <div key={item.id} className="space-y-1">
                  {/* Main Nav Item */}
                  <div className="flex items-center group">
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex-1 min-h-[38px] flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active && !hasSub
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                          : active && hasSub
                          ? "bg-zinc-100 dark:bg-zinc-800/90 text-zinc-950 dark:text-zinc-50 font-semibold border-l-2 border-zinc-900 dark:border-zinc-100 pl-2.5"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active && !hasSub
                            ? "text-white dark:text-zinc-900"
                            : active && hasSub
                            ? "text-zinc-950 dark:text-zinc-50"
                            : "text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                        }`}
                      />

                      <span className="truncate flex-1">{item.label}</span>

                      {item.badge && (
                        <span
                          className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-full font-medium ${
                            active && !hasSub
                              ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Expand Toggle Button for Submenu */}
                    {hasSub && (
                      <button
                        type="button"
                        onClick={(e) => toggleExpand(item.id, e)}
                        className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 cursor-pointer transition-colors shrink-0 ml-1"
                        aria-label={`Toggle ${item.label} submenu`}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Submenu Accordion */}
                  {hasSub && isExpanded && (
                    <div className="ml-5 pl-3 border-l border-zinc-200/80 dark:border-zinc-800 space-y-1 py-1">
                      {item.subItems!.map((sub) => {
                        const subActive = isSubActive(sub);
                        return (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            onClick={onCloseMobile}
                            className={`min-h-[32px] flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              subActive
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-850"
                            }`}
                          >
                            <span className="truncate">{sub.label}</span>
                            {sub.badge && (
                              <span
                                className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full ${
                                  subActive
                                    ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800 font-semibold"
                                    : "text-zinc-400"
                                }`}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Storefront Link */}
        <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70">
          <Link
            href="/"
            target="_blank"
            className="min-h-[38px] flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-zinc-400" />
              <span>Live storefront</span>
            </div>
            <span className="text-xs text-zinc-400 font-mono">↗</span>
          </Link>
        </div>
      </div>

      {/* User Account Footer */}
      <div className="shrink-0 p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/60">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100/70 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8 ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0">
              <AvatarFallback className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold">
                FN
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                Farhana Nasrin
              </span>
              <span className="text-[11px] text-zinc-400 truncate font-mono">
                Admin
              </span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 flex-1 flex max-w-xs w-full bg-white dark:bg-zinc-950 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
