"use client";

import React from "react";
import { ReviewsCMS } from "@/components/admin/reviews-cms";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance flex items-center gap-2.5">
            <span>Reviews</span>
            <Badge variant="outline" className="text-xs font-mono">
              Moderation
            </Badge>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Moderate customer ratings and verified buyer reviews.
          </p>
        </div>
      </div>

      <ReviewsCMS />
    </div>
  );
}
