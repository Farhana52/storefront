"use client";

import React, { useState } from "react";
import { TrendingUp, BarChart2 } from "lucide-react";

interface MonthlyPoint {
  month: string;
  total: number;
}

const MONTHLY_DATA: MonthlyPoint[] = [
  { month: "Jan", total: 145000 },
  { month: "Feb", total: 189000 },
  { month: "Mar", total: 220000 },
  { month: "Apr", total: 280000 },
  { month: "May", total: 240000 },
  { month: "Jun", total: 310000 },
  { month: "Jul", total: 295000 },
  { month: "Aug", total: 340000 },
  { month: "Sep", total: 390000 },
  { month: "Oct", total: 425000 },
];

export const OverviewChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(MONTHLY_DATA.length - 1);

  const maxVal = Math.max(...MONTHLY_DATA.map((d) => d.total));
  const height = 260;
  const width = 500;
  const paddingBottom = 28;
  const paddingTop = 20;
  const availableHeight = height - paddingBottom - paddingTop;

  const currentHovered = hoveredIdx !== null ? MONTHLY_DATA[hoveredIdx] : MONTHLY_DATA[MONTHLY_DATA.length - 1];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Revenue analytics
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
              <TrendingUp className="w-3 h-3" />
              +24.5% QoQ
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Gross sales volume across online store and concierge
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-white tabular-nums">
            ৳{currentHovered.total.toLocaleString()}
          </span>
          <p className="text-[10px] text-zinc-400 font-medium">
            {currentHovered.month} 2026
          </p>
        </div>
      </div>

      {/* SVG Bar Chart with Modern Subtle Gradient */}
      <div className="w-full pt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#27272a" />
            </linearGradient>
            <linearGradient id="barGradientDarkActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fafafa" />
              <stop offset="100%" stopColor="#d4d4d8" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const y = height - paddingBottom - ratio * availableHeight;
            return (
              <line
                key={ratio}
                x1="0"
                y1={y}
                x2={width}
                y2={y}
                stroke="currentColor"
                className="text-zinc-100 dark:text-zinc-800/80"
                strokeWidth="1"
                strokeDasharray={ratio > 0 && ratio < 1 ? "4 4" : "none"}
              />
            );
          })}

          {/* Vertical Bars */}
          {MONTHLY_DATA.map((d, i) => {
            const barWidth = 26;
            const barHeight = (d.total / maxVal) * availableHeight;
            const x = (i + 0.5) * (width / MONTHLY_DATA.length) - barWidth / 2;
            const y = height - paddingBottom - barHeight;
            const isHovered = hoveredIdx === i;
            const isHighest = d.total === maxVal;

            return (
              <g
                key={d.month}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredIdx(i)}
              >
                {/* Hit target */}
                <rect
                  x={x - 4}
                  y={paddingTop}
                  width={barWidth + 8}
                  height={availableHeight}
                  fill="transparent"
                />

                {/* Visible bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  className={`transition-all duration-200 ${
                    isHovered
                      ? "fill-zinc-950 dark:fill-zinc-50"
                      : isHighest
                      ? "fill-zinc-800/90 dark:fill-zinc-200/90"
                      : "fill-zinc-200 hover:fill-zinc-300 dark:fill-zinc-800 dark:hover:fill-zinc-700"
                  }`}
                />

                {/* X Axis Label */}
                <text
                  x={x + barWidth / 2}
                  y={height - 6}
                  textAnchor="middle"
                  className={`text-[11px] font-medium transition-colors ${
                    isHovered
                      ? "fill-zinc-950 dark:fill-zinc-50 font-bold"
                      : "fill-zinc-400 dark:fill-zinc-500"
                  }`}
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
