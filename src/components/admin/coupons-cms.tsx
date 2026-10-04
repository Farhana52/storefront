"use client";

import React, { useState } from "react";
import { useCMS } from "@/context/cms-context";
import { CouponConfig } from "@/types/cms";
import {
  TicketPercent,
  Plus,
  Trash2,
  Check,
  X,
  Tag,
  AlertCircle,
} from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const CouponsCMS: React.FC = () => {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useCMS();
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 10,
    minSpend: 2500,
    description: "",
    active: true,
  });

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || formData.discountPercent <= 0) return;

    addCoupon({
      code: formData.code.trim().toUpperCase(),
      discountPercent: Number(formData.discountPercent),
      minSpend: Number(formData.minSpend) || 0,
      description: formData.description.trim() || `${formData.discountPercent}% discount voucher`,
      active: formData.active,
    });

    setFormData({
      code: "",
      discountPercent: 10,
      minSpend: 2500,
      description: "",
      active: true,
    });
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            Active coupons
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Vouchers applied during checkout by customers.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsCreating(true)}
          size="sm"
          className="gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create coupon</span>
        </Button>
      </div>

      {/* Create Modal / Form */}
      {isCreating && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-zinc-500" />
              <span>Create coupon</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveCoupon} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Coupon code
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. VIP20"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Discount percentage (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPercent: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Minimum cart spend (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minSpend}
                  onChange={(e) =>
                    setFormData({ ...formData, minSpend: Number(e.target.value) })
                  }
                  placeholder="0 for no minimum"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Campaign description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. 20% discount on orders over ৳5,000 for registered customers"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                />
                <span>Active coupon</span>
              </label>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="shadow-2xs"
                >
                  Create coupon
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Coupon code</TableHead>
              <TableHead className="w-[14%]">Discount</TableHead>
              <TableHead className="w-[18%] text-right">Minimum spend</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center w-[12%]">Status</TableHead>
              <TableHead className="text-right w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      No coupons found
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Create discount promo codes to offer percentage discounts during checkout.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsCreating(true)}
                      className="mt-2 gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create coupon</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                      <Tag className="w-3 h-3 text-zinc-500" />
                      {coupon.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {coupon.discountPercent}% OFF
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-zinc-700 dark:text-zinc-300 tabular-nums">
                    {coupon.minSpend && coupon.minSpend > 0
                      ? `৳${coupon.minSpend.toLocaleString()}`
                      : "No minimum"}
                  </TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                    {coupon.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => toggleCoupon(coupon.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-pointer transition-colors active:scale-[0.96] ${
                        coupon.active
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
                      }`}
                      title={coupon.active ? "Click to deactivate" : "Click to activate"}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          coupon.active ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                      />
                      <span>{coupon.active ? "Active" : "Disabled"}</span>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => deleteCoupon(coupon.id)}
                      className="h-8 w-8 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

