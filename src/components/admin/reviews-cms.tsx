"use client";

import React, { useState, useMemo } from "react";
import { useCMS } from "@/context/cms-context";
import { ProductReview } from "@/types/cms";
import {
  Star,
  CheckCircle,
  EyeOff,
  Trash2,
  Plus,
  Search,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const ReviewsCMS: React.FC = () => {
  const { reviews, products, addReview, updateReviewStatus, deleteReview } =
    useCMS();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formState, setFormState] = useState<{
    productId: string;
    productTitle: string;
    authorName: string;
    authorEmail: string;
    rating: number;
    title: string;
    comment: string;
    verifiedPurchase: boolean;
  }>({
    productId: products[0]?.id || "1",
    productTitle: products[0]?.title || "Handmade Festive Gown",
    authorName: "",
    authorEmail: "",
    rating: 5,
    title: "",
    comment: "",
    verifiedPurchase: true,
  });

  const query = searchQuery.toLowerCase().trim();

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchStatus =
        statusFilter === "all" || r.status === statusFilter;
      const matchQuery =
        !query ||
        r.authorName.toLowerCase().includes(query) ||
        r.productTitle.toLowerCase().includes(query) ||
        r.comment.toLowerCase().includes(query);

      return matchStatus && matchQuery;
    });
  }, [reviews, statusFilter, query]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg =
      total > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
        : "5.0";
    const approved = reviews.filter((r) => r.status === "approved").length;
    const pending = reviews.filter((r) => r.status === "pending").length;

    return { total, avg, approved, pending };
  }, [reviews]);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.authorName || !formState.comment) return;

    addReview({
      productId: formState.productId,
      productTitle: formState.productTitle,
      authorName: formState.authorName,
      authorEmail: formState.authorEmail,
      rating: Number(formState.rating),
      title: formState.title,
      comment: formState.comment,
      status: "approved",
      verifiedPurchase: formState.verifiedPurchase,
    });

    setIsAddOpen(false);
    setFormState({
      productId: products[0]?.id || "1",
      productTitle: products[0]?.title || "Handmade Festive Gown",
      authorName: "",
      authorEmail: "",
      rating: 5,
      title: "",
      comment: "",
      verifiedPurchase: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            Customer reviews
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-pretty">
            Moderate customer feedback, manage verified buyer ratings, and track satisfaction metrics.
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add review</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500">Total reviews</span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {stats.total}
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500">Average rating</span>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 tabular-nums">
            <span>★ {stats.avg}</span>
            <span className="text-xs text-zinc-400 font-normal">/ 5.0</span>
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500">Approved</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {stats.approved}
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500">Pending review</span>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {stats.pending}
          </div>
        </Card>
      </div>

      {/* Segmented Status Tabs & Search Toolbar */}
      <div className="space-y-4">
        <div className="inline-flex p-1 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 text-xs overflow-x-auto max-w-full">
          {[
            { id: "all", label: "All", count: stats.total },
            { id: "approved", label: "Approved", count: stats.approved },
            { id: "pending", label: "Pending", count: stats.pending },
            {
              id: "hidden",
              label: "Hidden",
              count: reviews.filter((r) => r.status === "hidden").length,
            },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`font-mono text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isActive
                      ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800 font-semibold"
                      : "bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by customer, product, comment..."
            className="pl-8 text-xs h-9"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[22%]">Customer</TableHead>
              <TableHead className="w-[18%]">Product</TableHead>
              <TableHead className="w-[12%]">Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[12%]">Date</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      No reviews found
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      No customer reviews match your filter or search query.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusFilter("all");
                        setSearchQuery("");
                      }}
                      className="mt-2 text-xs"
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((rev) => (
                <TableRow key={rev.id}>
                  <TableCell>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>{rev.authorName}</span>
                      {rev.verifiedPurchase && (
                        <span title="Verified purchase">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {rev.authorEmail || "Verified customer"}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-zinc-700 dark:text-zinc-300 max-w-[160px] truncate">
                    {rev.productTitle}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-300 dark:text-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="max-w-xs">
                    {rev.title && (
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {rev.title}
                      </div>
                    )}
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 text-[11px]">
                      "{rev.comment}"
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        rev.status === "approved"
                          ? "success"
                          : rev.status === "pending"
                          ? "warning"
                          : "outline"
                      }
                      className="text-[10px] capitalize"
                    >
                      {rev.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-mono text-zinc-400 text-[11px] tabular-nums">
                    {rev.createdAt}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {rev.status !== "approved" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateReviewStatus(rev.id, "approved")}
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400"
                          title="Approve review"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      {rev.status !== "hidden" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateReviewStatus(rev.id, "hidden")}
                          className="h-8 w-8 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title="Hide review"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm(`Delete review from ${rev.authorName}?`)) {
                            deleteReview(rev.id);
                          }
                        }}
                        className="h-8 w-8 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Review Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                  Add customer review
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddOpen(false)}
                className="h-7 w-7 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Select product
                </label>
                <select
                  value={formState.productId}
                  onChange={(e) => {
                    const sel = products.find((p) => p.id === e.target.value);
                    setFormState({
                      ...formState,
                      productId: e.target.value,
                      productTitle: sel?.title || "",
                    });
                  }}
                  className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (৳{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Customer name
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Mahira Chowdhury"
                    value={formState.authorName}
                    onChange={(e) =>
                      setFormState({ ...formState, authorName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Customer email
                  </label>
                  <Input
                    type="email"
                    placeholder="mahira@example.com"
                    value={formState.authorEmail}
                    onChange={(e) =>
                      setFormState({ ...formState, authorEmail: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Rating (1 to 5)
                  </label>
                  <select
                    value={formState.rating}
                    onChange={(e) =>
                      setFormState({ ...formState, rating: Number(e.target.value) })
                    }
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                  >
                    <option value={5}>★★★★★ (5 stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 stars - Very good)</option>
                    <option value={3}>★★★☆☆ (3 stars - Average)</option>
                    <option value={2}>★★☆☆☆ (2 stars - Below average)</option>
                    <option value={1}>★☆☆☆☆ (1 star - Poor)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Review headline
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Impeccable drape & fabric"
                    value={formState.title}
                    onChange={(e) =>
                      setFormState({ ...formState, title: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Review comment
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share the customer's impressions on texture, fit, and craftsmanship..."
                  value={formState.comment}
                  onChange={(e) =>
                    setFormState({ ...formState, comment: e.target.value })
                  }
                  className="w-full rounded-md border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="verified-check"
                  checked={formState.verifiedPurchase}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      verifiedPurchase: e.target.checked,
                    })
                  }
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
                />
                <label
                  htmlFor="verified-check"
                  className="font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  Mark as verified purchase
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Add review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
