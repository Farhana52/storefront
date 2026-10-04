"use client";

import React from "react";
import Link from "next/link";
import { useCMS } from "@/context/cms-context";
import { KPICardsGrid } from "@/components/admin/kpi-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { REVENUE_TREND_DATA } from "@/data/admin-data";
import {
  ShoppingBag,
  Package,
  UserPlus,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Crown,
  Clock,
  CheckCircle2,
  Layers,
  TicketPercent,
  SlidersHorizontal,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { orders, customers, products, categories, coupons, reviews } = useCMS();

  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === "pending" || o.orderStatus === "processing"
  ).length;

  const vipPatronsCount = customers.filter(
    (c) => c.tier === "VIP Patron" || c.tier === "Gold Member"
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              Operations Center
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected & active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            Dashboard
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Live overview of store activity, orders fulfillment, customer accounts, and catalog status.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/products/new">
            <Button size="sm" className="gap-1.5 shadow-2xs">
              <Package className="w-3.5 h-3.5" />
              <span>Add product</span>
            </Button>
          </Link>

          <Link href="/admin/customers/new">
            <Button size="sm" variant="outline" className="gap-1.5 shadow-2xs">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add customer</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <KPICardsGrid />

      {/* Sales & Orders Overview Telemetry Chart */}
      <RevenueChart data={REVENUE_TREND_DATA} />

      {/* Quick Access Grid: Recent Orders & VIP Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Commerce Activity (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Recent orders
              </h3>
              <p className="text-[11px] text-zinc-400">
                {pendingOrdersCount} orders currently in fulfillment queue
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View all ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100 hover:underline tabular-nums"
                      >
                        {order.id}
                      </Link>
                      <Badge
                        variant={
                          order.orderStatus === "delivered"
                            ? "success"
                            : order.orderStatus === "processing"
                            ? "default"
                            : "outline"
                        }
                        className="text-[10px] capitalize py-0"
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 truncate">
                      {order.customer.name} • {order.shippingCity} ({order.paymentMethod.toUpperCase()})
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 tabular-nums">
                      ৳{order.totalAmount.toLocaleString()}
                    </div>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline font-medium block mt-0.5"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-900 text-center">
              <Link
                href="/admin/orders"
                className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                View all orders →
              </Link>
            </div>
          </div>
        </div>

        {/* Right: VIP Customers & CMS Status (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* VIP Customers Snapshot */}
          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Top customers
                </h3>
              </div>
              <Link
                href="/admin/customers"
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline font-medium"
              >
                All customers ({customers.length})
              </Link>
            </div>

            <div className="space-y-3">
              {customers.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/customers/${c.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative border border-zinc-200 dark:border-zinc-800 shrink-0">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline truncate">
                        {c.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono tabular-nums">
                        {c.city} • {c.phone}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <Badge variant="outline" className="text-[10px]">
                      {c.tier}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/admin/customers/new" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add customer</span>
              </Button>
            </Link>
          </div>

          {/* Quick Hub to Dedicated Subpages */}
          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Storefront sections
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/admin/products"
                className="p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Products
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono tabular-nums">
                    {products.length} items
                  </div>
                </div>
                <Package className="w-4 h-4 text-zinc-400" />
              </Link>

              <Link
                href="/admin/analytics"
                className="p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Analytics
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    Live telemetry
                  </div>
                </div>
                <BarChart3 className="w-4 h-4 text-emerald-500" />
              </Link>

              <Link
                href="/admin/categories"
                className="p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Categories
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono tabular-nums">
                    {categories.length} categories
                  </div>
                </div>
                <Layers className="w-4 h-4 text-zinc-400" />
              </Link>

              <Link
                href="/admin/coupons"
                className="p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Coupons
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono tabular-nums">
                    {coupons.length} vouchers
                  </div>
                </div>
                <TicketPercent className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
