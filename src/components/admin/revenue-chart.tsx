"use client";

import React, { useState } from "react";
import { RevenuePoint } from "@/data/admin-data";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: RevenuePoint[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [showRevenue, setShowRevenue] = useState(true);
  const [showOrders, setShowOrders] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(data.length - 1);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("30d");

  // SVG dimensions
  const width = 680;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const maxOrders = Math.max(...data.map((d) => d.orders));

  // Compute points
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const yRevenue = height - paddingY - (d.revenue / maxRevenue) * (height - paddingY * 2);
    const barHeight = (d.orders / maxOrders) * (height - paddingY * 2);
    const yBar = height - paddingY - barHeight;
    return { x, yRevenue, yBar, barHeight, ...d };
  });

  // Construct smooth curve for revenue
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.yRevenue}`;
    const prev = arr[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.yRevenue} ${cx},${pt.yRevenue} ${pt.x},${pt.yRevenue}`;
  }, "");

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Sales & Orders Overview with Bars + Trendline (SellHive Style) */}
      <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
        {/* Header with checkboxes and dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/70 dark:border-zinc-800/70">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              Sales and orders overview
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Orders (units)</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-white" />
                <span>Revenue (৳)</span>
              </span>
            </div>
          </div>

          {/* Right: Checkbox Toggles & Timeframe selector */}
          <div className="flex items-center gap-3 self-start sm:self-auto text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-zinc-600 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={showRevenue}
                onChange={(e) => setShowRevenue(e.target.checked)}
                className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
              />
              <span>Revenue</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-zinc-600 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={showOrders}
                onChange={(e) => setShowOrders(e.target.checked)}
                className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Orders</span>
            </label>

            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 cursor-pointer focus:outline-none"
            >
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="quarter">Quarterly</option>
            </select>
          </div>
        </div>

        {/* Hover Pill Tooltip Preview */}
        <div className="py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-400 dark:text-zinc-500">
              {activePoint.date}, 2026:
            </span>
            <span className="font-extrabold text-zinc-950 dark:text-white font-mono text-sm">
              ৳{activePoint.revenue.toLocaleString()}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {activePoint.orders} Orders Handled
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">Hover points to trace</span>
        </div>

        {/* SVG Combined Bars + Line Graph */}
        <div className="relative w-full pt-2 pb-1">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-48 sm:h-56 overflow-visible select-none"
          >
            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((pct) => {
              const y = height - paddingY - pct * (height - paddingY * 2);
              return (
                <line
                  key={pct}
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  className="text-zinc-100 dark:text-zinc-800/80"
                  strokeWidth="1"
                />
              );
            })}

            {/* Vertical Order Bars (SellHive Signature Style) */}
            {showOrders &&
              points.map((pt, i) => {
                const isHovered = hoveredIndex === i;
                const barWidth = 18;
                return (
                  <rect
                    key={`bar-${i}`}
                    x={pt.x - barWidth / 2}
                    y={pt.yBar}
                    width={barWidth}
                    height={pt.barHeight}
                    rx="4"
                    className={`transition-all duration-200 ${
                      isHovered
                        ? "fill-emerald-500 opacity-95"
                        : "fill-emerald-500/70 hover:fill-emerald-500/90"
                    }`}
                  />
                );
              })}

            {/* Revenue Trend Line */}
            {showRevenue && (
              <path
                d={pathD}
                fill="none"
                stroke="currentColor"
                className="text-zinc-950 dark:text-white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Overlay & Markers */}
            {points.map((pt, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <g
                  key={`point-${i}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                >
                  <circle cx={pt.x} cy={pt.yRevenue} r="18" fill="transparent" />

                  {showRevenue && (
                    <circle
                      cx={pt.x}
                      cy={pt.yRevenue}
                      r={isHovered ? 5 : 3.5}
                      className={`transition-all duration-150 ${
                        isHovered
                          ? "fill-zinc-950 dark:fill-white stroke-4 stroke-white dark:stroke-zinc-950"
                          : "fill-white dark:fill-zinc-900 stroke-2 stroke-zinc-950 dark:stroke-white"
                      }`}
                    />
                  )}
                </g>
              );
            })}

            {/* X Axis Labels */}
            {points.map((pt, i) => (
              <text
                key={`label-${i}`}
                x={pt.x}
                y={height - 6}
                textAnchor="middle"
                className={`text-[10px] font-mono transition-colors ${
                  hoveredIndex === i
                    ? "fill-zinc-950 dark:fill-white font-bold"
                    : "fill-zinc-400 dark:fill-zinc-500"
                }`}
              >
                {pt.date}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Right 1 Col: Stacked KPI Cards with Sparklines (SellHive Style) */}
      <div className="flex flex-col justify-between gap-4">
        {/* KPI 1: Total Sales */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Total sales volume
            </span>
            <h4 className="text-2xl font-bold text-zinc-950 dark:text-white font-mono mt-1 tabular-nums">
              ৳2,845,900
            </h4>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+20% from last month</span>
            </div>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="w-20 h-10">
            <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible">
              <path
                d="M 0,35 Q 20,20 40,25 T 80,5"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 2: Orders Processed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Orders processed
            </span>
            <h4 className="text-2xl font-bold text-zinc-950 dark:text-white font-mono mt-1 tabular-nums">
              1,284
            </h4>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+12.6% from last month</span>
            </div>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="w-20 h-10">
            <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible">
              <path
                d="M 0,30 Q 25,35 50,15 T 80,8"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 3: Avg Order Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Average order value
            </span>
            <h4 className="text-2xl font-bold text-zinc-950 dark:text-white font-mono mt-1 tabular-nums">
              ৳2,215
            </h4>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+4.8% from last month</span>
            </div>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="w-20 h-10">
            <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible">
              <path
                d="M 0,25 Q 30,10 50,22 T 80,10"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
