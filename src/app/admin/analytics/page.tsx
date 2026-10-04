"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMS } from "@/context/cms-context";
import {
  REVENUE_TREND_DATA,
  CATEGORY_PERFORMANCE,
} from "@/data/admin-data";
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Crown,
  Calendar,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function AdminAnalyticsPage() {
  const { products, orders, customers } = useCMS();

  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(
    REVENUE_TREND_DATA.length - 1
  );
  const [showRevenueLayer, setShowRevenueLayer] = useState(true);
  const [showOrdersLayer, setShowOrdersLayer] = useState(true);

  // Dynamic calculations from CMS
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const totalOrders = orders.length;

  const avgOrderValue = useMemo(() => {
    return totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  }, [totalRevenue, totalOrders]);

  // Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 240;
  const padX = 40;
  const padY = 28;

  const maxRevenue = Math.max(...REVENUE_TREND_DATA.map((d) => d.revenue));
  const maxOrders = Math.max(...REVENUE_TREND_DATA.map((d) => d.orders));

  const chartPoints = useMemo(() => {
    return REVENUE_TREND_DATA.map((d, index) => {
      const x = padX + (index / (REVENUE_TREND_DATA.length - 1)) * (chartWidth - padX * 2);
      const yRev =
        chartHeight - padY - (d.revenue / maxRevenue) * (chartHeight - padY * 2);
      const barHeight = (d.orders / maxOrders) * (chartHeight - padY * 2);
      const yBar = chartHeight - padY - barHeight;
      return { x, yRev, yBar, barHeight, ...d };
    });
  }, [maxRevenue, maxOrders]);

  // SVG smooth curve
  const curvePath = useMemo(() => {
    return chartPoints.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.yRev}`;
      const prev = arr[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx},${prev.yRev} ${cx},${pt.yRev} ${pt.x},${pt.yRev}`;
    }, "");
  }, [chartPoints]);

  // Area fill under curve
  const areaPath = useMemo(() => {
    if (chartPoints.length === 0) return "";
    const firstX = chartPoints[0].x;
    const lastX = chartPoints[chartPoints.length - 1].x;
    const bottomY = chartHeight - padY;
    return `${curvePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [curvePath, chartPoints]);

  const activePoint =
    hoveredPointIndex !== null
      ? chartPoints[hoveredPointIndex]
      : chartPoints[chartPoints.length - 1];

  // Clean conversion funnel stages
  const funnelSteps = [
    { stage: "Store Visits", count: "52,400", pct: "100%", color: "bg-zinc-900 dark:bg-zinc-100" },
    { stage: "Product Views", count: "21,850", pct: "41.7%", color: "bg-zinc-700 dark:bg-zinc-300" },
    { stage: "Added to Bag", count: "6,420", pct: "12.3%", color: "bg-zinc-600 dark:bg-zinc-400" },
    { stage: "Checkout Started", count: "2,840", pct: "5.4%", color: "bg-zinc-500 dark:bg-zinc-500" },
    {
      stage: "Completed Orders",
      count: String(totalOrders > 0 ? totalOrders : "1,284"),
      pct: "2.8%",
      color: "bg-emerald-600 dark:bg-emerald-500",
    },
  ];

  // Top products
  const topProducts = useMemo(() => {
    return products.slice(0, 5).map((p, idx) => ({
      ...p,
      salesCount: 48 - idx * 7,
      totalVolume: (48 - idx * 7) * p.price,
    }));
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header & High-Contrast Tabs Component */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Analytics
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Store performance, revenue breakdown, and order metrics.
          </p>
        </div>

        {/* Component Library Tabs */}
        <Tabs
          value={timeframe}
          onValueChange={(val) => setTimeframe(val as any)}
          className="w-auto self-start sm:self-auto"
        >
          <TabsList className="bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 p-1">
            <TabsTrigger value="7d" className="text-xs px-3 py-1">
              7 days
            </TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-3 py-1">
              30 days
            </TabsTrigger>
            <TabsTrigger value="90d" className="text-xs px-3 py-1">
              Quarter
            </TabsTrigger>
            <TabsTrigger value="1y" className="text-xs px-3 py-1">
              Year
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 4 Standardized KPI Card Primitives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
              Total Revenue
            </span>
            <Badge variant="success" className="gap-0.5 text-[11px] font-mono py-0">
              <TrendingUp className="w-3 h-3" />
              +18.4%
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            ৳{totalRevenue > 0 ? totalRevenue.toLocaleString() : "2,845,900"}
          </div>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
              <path
                d="M 0,16 Q 25,18 40,8 T 75,6 T 100,2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-500"
              />
            </svg>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
              Orders
            </span>
            <Badge variant="success" className="gap-0.5 text-[11px] font-mono py-0">
              <TrendingUp className="w-3 h-3" />
              +12.6%
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {totalOrders > 0 ? totalOrders : "1,284"}
          </div>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
              <path
                d="M 0,14 Q 30,15 50,7 T 80,10 T 100,3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-zinc-900 dark:text-zinc-100"
              />
            </svg>
          </div>
        </Card>

        {/* Average Order Value */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
              Average Order Value
            </span>
            <Badge variant="success" className="gap-0.5 text-[11px] font-mono py-0">
              <TrendingUp className="w-3 h-3" />
              +5.2%
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            ৳{avgOrderValue > 0 ? avgOrderValue.toLocaleString() : "4,850"}
          </div>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
              <path
                d="M 0,12 Q 25,5 50,11 T 75,7 T 100,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-zinc-600 dark:text-zinc-300"
              />
            </svg>
          </div>
        </Card>

        {/* Repeat Customer Rate */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-zinc-400" />
              Repeat Customers
            </span>
            <Badge variant="success" className="gap-0.5 text-[11px] font-mono py-0">
              <TrendingUp className="w-3 h-3" />
              +8.1%
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            74.2%
          </div>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
              <path
                d="M 0,18 Q 30,12 60,8 T 85,5 T 100,2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-500"
              />
            </svg>
          </div>
        </Card>
      </div>

      {/* Main Dual-Layer Chart inside Card */}
      <Card className="p-5 space-y-4">
        {/* Chart Header & Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-900">
          <div>
            <CardTitle className="text-sm font-semibold">Revenue & Volume</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Daily trend of total sales and order dispatches.
            </CardDescription>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={showRevenueLayer}
                onChange={(e) => setShowRevenueLayer(e.target.checked)}
                className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 inline-block" />
              <span>Revenue (৳)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={showOrdersLayer}
                onChange={(e) => setShowOrdersLayer(e.target.checked)}
                className="rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Orders</span>
            </label>
          </div>
        </div>

        {/* Hover Summary Bar */}
        {activePoint && (
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{activePoint.date}, 2026</span>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-zinc-400 mr-1.5">Revenue:</span>
                <strong className="font-mono font-semibold text-zinc-900 dark:text-zinc-50 tabular-nums">
                  ৳{activePoint.revenue.toLocaleString()}
                </strong>
              </div>

              <div>
                <span className="text-zinc-400 mr-1.5">Orders:</span>
                <strong className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {activePoint.orders} units
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Responsive SVG Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-60 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="analyticsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padY + ratio * (chartHeight - padY * 2);
                const labelVal = Math.round(maxRevenue * (1 - ratio));
                return (
                  <g key={idx}>
                    <line
                      x1={padX}
                      y1={y}
                      x2={chartWidth - padX}
                      y2={y}
                      stroke="currentColor"
                      className="text-zinc-100 dark:text-zinc-800/80"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padX - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[9px] fill-zinc-400 font-mono"
                    >
                      ৳{(labelVal / 1000).toFixed(0)}k
                    </text>
                  </g>
                );
              })}

              {/* Bar Layer (Orders) */}
              {showOrdersLayer &&
                chartPoints.map((pt, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  const barWidth = 14;
                  return (
                    <rect
                      key={idx}
                      x={pt.x - barWidth / 2}
                      y={pt.yBar}
                      width={barWidth}
                      height={pt.barHeight}
                      rx="3"
                      className={`transition-colors cursor-pointer ${
                        isHovered
                          ? "fill-emerald-500"
                          : "fill-emerald-200/70 dark:fill-emerald-950/80 hover:fill-emerald-400"
                      }`}
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                    />
                  );
                })}

              {/* Revenue Area & Curve */}
              {showRevenueLayer && (
                <>
                  <path
                    d={areaPath}
                    className="text-zinc-900 dark:text-zinc-100 fill-current"
                    style={{ fill: "url(#analyticsAreaGrad)" }}
                  />
                  <path
                    d={curvePath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-zinc-950 dark:text-zinc-100"
                  />
                </>
              )}

              {/* Data Points on Hover */}
              {chartPoints.map((pt, idx) => {
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g key={idx}>
                    {/* Invisible hover trigger */}
                    <rect
                      x={pt.x - (chartWidth - padX * 2) / (chartPoints.length * 2)}
                      y={padY}
                      width={(chartWidth - padX * 2) / chartPoints.length}
                      height={chartHeight - padY * 2}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                    />

                    {/* Point Circle */}
                    {showRevenueLayer && (
                      <circle
                        cx={pt.x}
                        cy={pt.yRev}
                        r={isHovered ? 5 : 3}
                        className={`transition-all ${
                          isHovered
                            ? "fill-zinc-950 dark:fill-white stroke-3 stroke-white dark:stroke-zinc-900"
                            : "fill-zinc-900 dark:fill-zinc-100"
                        }`}
                      />
                    )}

                    {/* X-Axis Dates */}
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className={`text-[10px] font-mono transition-colors ${
                        isHovered
                          ? "fill-zinc-900 dark:fill-zinc-100 font-bold"
                          : "fill-zinc-400"
                      }`}
                    >
                      {pt.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </Card>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Conversion Funnel & Top Products (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Conversion Funnel */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">Conversion Funnel</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Visitor journey from visit to purchase.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                2.8% Conversion
              </Badge>
            </div>

            <div className="space-y-3">
              {funnelSteps.map((step, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {step.stage}
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400 tabular-nums">{step.count}</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 min-w-[40px] text-right tabular-nums">
                        {step.pct}
                      </span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${step.color} transition-all duration-300`}
                      style={{
                        width: step.pct === "100%" ? "100%" : `${parseFloat(step.pct) * 2}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Selling Products */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">Top Products</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Ranked by volume and sales.
                </CardDescription>
              </div>
              <Link
                href="/admin/analytics/top-products"
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 font-medium inline-flex items-center gap-1 group transition-colors"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {topProducts.map((p, idx) => (
                <div
                  key={p.id}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-zinc-400 text-xs w-4">
                      {idx + 1}
                    </span>
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px] py-0">
                          {p.category}
                        </Badge>
                        <span className="tabular-nums">{p.salesCount} sold</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 text-xs tabular-nums">
                      ৳{p.totalVolume.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Category Distribution & Courier Regions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category Share */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <CardTitle className="text-sm font-semibold">Sales by Category</CardTitle>
              <span className="text-xs text-zinc-400 font-mono">
                {CATEGORY_PERFORMANCE.length} Categories
              </span>
            </div>

            <div className="space-y-3.5">
              {CATEGORY_PERFORMANCE.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </span>
                    <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                      ৳{cat.revenue.toLocaleString()} ({cat.percentage}%)
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Regional Deliveries */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <CardTitle className="text-sm font-semibold">Regional Distribution</CardTitle>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { city: "Dhaka", pct: 62, count: "796 orders" },
                { city: "Chittagong", pct: 22, count: "282 orders" },
                { city: "Sylhet", pct: 10, count: "128 orders" },
                { city: "Other Divisions", pct: 6, count: "78 orders" },
              ].map((reg, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-zinc-800 dark:text-zinc-200">{reg.city}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-zinc-400 text-[11px] tabular-nums">{reg.count}</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {reg.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full"
                      style={{ width: `${reg.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
