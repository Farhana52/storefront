"use client";

import React from "react";
import { CouponsCMS } from "@/components/admin/coupons-cms";
import { TicketPercent } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance flex items-center gap-2.5">
            <span>Coupons</span>
            <Badge variant="outline" className="text-xs font-mono">
              Campaigns
            </Badge>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Create promotional discount codes, percentage reductions, and minimum spend rules.
          </p>
        </div>
      </div>

      <CouponsCMS />
    </div>
  );
}
