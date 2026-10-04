"use client";

import React from "react";
import Link from "next/link";
import { useCMS } from "@/context/cms-context";
import { InventoryTable } from "@/components/admin/inventory-table";
import { Plus, Download, PackageCheck, AlertTriangle, Layers, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  const { products, categories } = useCMS();

  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.length - inStockCount;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            Products
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Manage product catalog, inventory stock, categories, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/products/new">
            <Button size="sm" className="gap-1.5 shadow-2xs">
              <Plus className="w-4 h-4" />
              <span>Add product</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/products"
          className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-zinc-400" />
            Total products
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {products.length}
          </div>
        </Link>

        <Link
          href="/admin/products?stock=in"
          className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
            In stock
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {inStockCount}
          </div>
        </Link>

        <Link
          href="/admin/products?stock=out"
          className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" />
            Sold out
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {outOfStockCount}
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            Categories
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {categories.length}
          </div>
        </Link>
      </div>

      {/* Main Inventory DataTable */}
      <InventoryTable />
    </div>
  );
}
