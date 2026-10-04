"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, Search, RefreshCw, ChevronRight } from "lucide-react";

interface AdminHeaderProps {
  onToggleMobile: () => void;
  activeTab?: string;
  onRefresh: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenCommandPalette?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobile,
  activeTab,
  onRefresh,
  searchQuery = "",
  onSearchChange,
  onOpenCommandPalette,
}) => {
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getBreadcrumbs = () => {
    if (pathname === "/admin") {
      return [{ label: "Dashboard", href: "/admin" }];
    }

    const crumbs: { label: string; href: string }[] = [];

    if (pathname.startsWith("/admin/products/sizes")) {
      crumbs.push({ label: "Variations", href: "/admin/products/sizes" });
      crumbs.push({ label: "Sizes", href: "/admin/products/sizes" });
    } else if (pathname.startsWith("/admin/products/colors")) {
      crumbs.push({ label: "Variations", href: "/admin/products/sizes" });
      crumbs.push({ label: "Color shades", href: "/admin/products/colors" });
    } else if (pathname.startsWith("/admin/products")) {
      crumbs.push({ label: "Products", href: "/admin/products" });
      if (pathname === "/admin/products/new") {
        crumbs.push({ label: "Add product", href: "/admin/products/new" });
      } else if (pathname.includes("/admin/products/")) {
        crumbs.push({ label: "Edit product", href: pathname });
      }
    } else if (pathname.startsWith("/admin/customers")) {
      crumbs.push({ label: "Customers", href: "/admin/customers" });
      if (pathname === "/admin/customers/new") {
        crumbs.push({ label: "Add customer", href: "/admin/customers/new" });
      } else if (pathname.includes("/admin/customers/")) {
        crumbs.push({ label: "Customer profile", href: pathname });
      }
    } else if (pathname.startsWith("/admin/orders")) {
      crumbs.push({ label: "Orders", href: "/admin/orders" });
      if (pathname === "/admin/orders/new") {
        crumbs.push({ label: "Create order", href: "/admin/orders/new" });
      } else if (pathname.includes("/admin/orders/")) {
        crumbs.push({ label: "Order details", href: pathname });
      }
    } else if (pathname === "/admin/analytics") {
      crumbs.push({ label: "Analytics", href: "/admin/analytics" });
    } else if (pathname === "/admin/categories") {
      crumbs.push({ label: "Categories", href: "/admin/categories" });
    } else if (pathname === "/admin/reviews") {
      crumbs.push({ label: "Reviews", href: "/admin/reviews" });
    } else if (pathname === "/admin/slider") {
      crumbs.push({ label: "Slider", href: "/admin/slider" });
    } else if (pathname === "/admin/content") {
      crumbs.push({ label: "Content", href: "/admin/content" });
    } else if (pathname === "/admin/coupons") {
      crumbs.push({ label: "Coupons", href: "/admin/coupons" });
    } else if (pathname === "/admin/shipping") {
      crumbs.push({ label: "Shipping", href: "/admin/shipping" });
    } else if (pathname === "/admin/communications") {
      crumbs.push({ label: "Communications", href: "/admin/communications" });
    } else {
      crumbs.push({ label: "Overview", href: "/admin" });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-20 w-full h-14 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 flex items-center px-4 sm:px-6 justify-between gap-4">
      {/* Left: Mobile Toggle & Dynamic Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer active:scale-95 transition-transform"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium">
          <Link
            href="/admin"
            className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Admin
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href + idx}>
              <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold truncate max-w-[180px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center/Right: Quick Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Search trigger with ⌘K badge */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="relative w-40 sm:w-64 flex items-center pl-8 pr-10 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 text-left transition-colors cursor-pointer group shadow-2xs"
          aria-label="Search CRM (Command + K)"
        >
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors pointer-events-none" />
          <span className="truncate">Search CRM...</span>
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1 hidden sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Refresh button */}
        <button
          type="button"
          onClick={handleRefreshClick}
          className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
          title="Refresh data"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              isRefreshing ? "animate-spin text-zinc-900 dark:text-zinc-100" : ""
            }`}
          />
        </button>

        {/* Theme Mode Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};
