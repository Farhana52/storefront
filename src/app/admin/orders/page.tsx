"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCMS } from "@/context/cms-context";
import { AdminOrder, AdminOrderStatus } from "@/data/admin-data";
import {
  ShoppingBag,
  Plus,
  Search,
  Download,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  FileText,
  User,
  Filter,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  CreditCard,
  Ban,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { orders, updateOrderStatus } = useCMS();

  const urlStatus = searchParams.get("status") || "all";
  const [statusFilter, setStatusFilter] = useState<string>(urlStatus);
  const [searchQuery, setSearchQuery] = useState("");

  // Specialized Sub-filters for Cancelled orders
  const [cancelledReasonFilter, setCancelledReasonFilter] = useState<string>("all");
  const [refundStatusFilter, setRefundStatusFilter] = useState<string>("all");

  // Specialized Sub-filters for Pending & Shipped
  const [courierFilter, setCourierFilter] = useState<string>("all");
  const [paymentPendingFilter, setPaymentPendingFilter] = useState<string>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Keep state synced with URL search params and reset page on filter changes
  useEffect(() => {
    if (urlStatus) {
      setStatusFilter(urlStatus);
    }
    setCurrentPage(1);
  }, [
    urlStatus,
    searchQuery,
    cancelledReasonFilter,
    refundStatusFilter,
    courierFilter,
    paymentPendingFilter,
  ]);

  const handleTabChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    if (newStatus === "all") {
      router.push("/admin/orders");
    } else {
      router.push(`/admin/orders?status=${newStatus}`);
    }
  };

  const query = searchQuery.toLowerCase().trim();

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.orderStatus === "pending").length,
      processing: orders.filter((o) => o.orderStatus === "processing").length,
      shipped: orders.filter((o) => o.orderStatus === "shipped").length,
      delivered: orders.filter((o) => o.orderStatus === "delivered").length,
      cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
    };
  }, [orders]);

  // Filtered orders with sub-filters applied
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Base status match
      const matchStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;

      // 2. Search query match
      const matchQuery =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.phone.toLowerCase().includes(query) ||
        order.paymentMethod.toLowerCase().includes(query) ||
        order.shippingCity.toLowerCase().includes(query);

      // 3. Sub-filter: Courier match
      const matchCourier =
        courierFilter === "all" ||
        order.courier.toLowerCase().includes(courierFilter.toLowerCase());

      // 4. Sub-filter: Payment match
      const matchPayment =
        paymentPendingFilter === "all" ||
        order.paymentMethod.toLowerCase() === paymentPendingFilter.toLowerCase();

      // 5. Sub-filter: Cancelled specific filters (simulated metadata)
      const matchCancelledReason =
        cancelledReasonFilter === "all" || true;

      const matchRefund =
        refundStatusFilter === "all" || true;

      return (
        matchStatus &&
        matchQuery &&
        matchCourier &&
        matchPayment &&
        matchCancelledReason &&
        matchRefund
      );
    });
  }, [
    orders,
    statusFilter,
    query,
    courierFilter,
    paymentPendingFilter,
    cancelledReasonFilter,
    refundStatusFilter,
  ]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const totalGrossRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const cancelledRevenue = useMemo(() => {
    return orders
      .filter((o) => o.orderStatus === "cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const handleExportCSV = () => {
    const headers = "Order ID,Customer,Phone,City,Total,Method,Status,Date\n";
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.id}","${o.customer.name}","${o.customer.phone}","${o.shippingCity}",${o.totalAmount},"${o.paymentMethod}","${o.orderStatus}","${o.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${statusFilter}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: AdminOrderStatus) => {
    switch (status) {
      case "delivered":
        return {
          label: "Delivered",
          dotColor: "bg-emerald-500",
          className:
            "bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60",
        };
      case "shipped":
        return {
          label: "In transit",
          dotColor: "bg-indigo-500",
          className:
            "bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/70 dark:border-indigo-800/60",
        };
      case "processing":
        return {
          label: "Processing",
          dotColor: "bg-sky-500 animate-pulse",
          className:
            "bg-sky-50/80 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/70 dark:border-sky-800/60",
        };
      case "pending":
        return {
          label: "Pending",
          dotColor: "bg-amber-500 animate-pulse",
          className:
            "bg-amber-50/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/60",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          dotColor: "bg-rose-500",
          className:
            "bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/70 dark:border-rose-800/60",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <span>Orders</span>
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="capitalize text-xs font-normal">
                {statusFilter}
              </Badge>
            )}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Track customer orders, verify payments, and manage garment fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 shadow-2xs text-xs"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export CSV</span>
          </Button>

          <Link href="/admin/orders/new">
            <Button size="sm" className="gap-1.5 shadow-2xs text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Create order</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats (Clean Neutral Surfaces) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
            Total Orders
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {orders.length}
          </div>
          <div className="text-[10px] text-zinc-400">
            All-time placed
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            Awaiting Fulfillment
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {statusCounts.pending + statusCounts.processing}
          </div>
          <div className="text-[10px] text-zinc-400">
            {statusCounts.pending} pending, {statusCounts.processing} in progress
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
            Delivered
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {statusCounts.delivered}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            99.2% delivery success
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
            <Ban className="w-3.5 h-3.5 text-zinc-400" />
            Cancelled & Returned
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {statusCounts.cancelled}
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
            ৳{cancelledRevenue.toLocaleString()} void volume
          </div>
        </div>
      </div>

      {/* Main Status Segmented Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs">
        {[
          { key: "all", label: "All Orders", count: orders.length },
          { key: "pending", label: "Pending Verification", count: statusCounts.pending },
          { key: "processing", label: "Packaging", count: statusCounts.processing },
          { key: "shipped", label: "In Transit", count: statusCounts.shipped },
          { key: "delivered", label: "Delivered", count: statusCounts.delivered },
          { key: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-850"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  isActive
                    ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800 font-semibold"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Unified DataTable Toolbar (shadcn style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order, customer, city..."
              className="pl-9 text-xs h-9"
            />
          </div>

          {/* Courier Partner Filter */}
          <select
            value={courierFilter}
            onChange={(e) => setCourierFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">All Couriers</option>
            <option value="Steadfast">Steadfast Express</option>
            <option value="Pathao">Pathao Courier</option>
            <option value="RedX">RedX Logistics</option>
          </select>

          {/* Contextual Sub-filters */}
          {statusFilter === "pending" && (
            <select
              value={paymentPendingFilter}
              onChange={(e) => setPaymentPendingFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              <option value="all">All Payment Statuses</option>
              <option value="bkash">bKash Trx Required</option>
              <option value="nagad">Nagad Required</option>
              <option value="cod">COD Verification</option>
            </select>
          )}

          {statusFilter === "cancelled" && (
            <>
              <select
                value={cancelledReasonFilter}
                onChange={(e) => setCancelledReasonFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                <option value="all">All Cancellation Reasons</option>
                <option value="size">Size / Fit Issue</option>
                <option value="courier">Courier Area Unreachable</option>
                <option value="payment">Payment Verification Failed</option>
                <option value="mind">Customer Changed Mind</option>
              </select>

              <select
                value={refundStatusFilter}
                onChange={(e) => setRefundStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                <option value="all">All Refund Statuses</option>
                <option value="refunded">Refund Issued</option>
                <option value="credit">Store Credit</option>
                <option value="cod">COD Order</option>
                <option value="pending">Refund Pending</option>
              </select>
            </>
          )}

          {/* Reset Filters */}
          {(searchQuery || courierFilter !== "all" || paymentPendingFilter !== "all" || cancelledReasonFilter !== "all" || refundStatusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCourierFilter("all");
                setPaymentPendingFilter("all");
                setCancelledReasonFilter("all");
                setRefundStatusFilter("all");
              }}
              className="h-9 px-2.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>

        <div className="text-xs text-zinc-500 font-mono shrink-0">
          Showing <strong>{filteredOrders.length}</strong> of {orders.length} orders
        </div>
      </div>

      {/* Main Orders Table */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <Table className="min-w-[960px] w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-zinc-200/80 dark:border-zinc-800">
                <TableHead className="w-[120px] whitespace-nowrap">Order ID</TableHead>
                <TableHead className="min-w-[200px]">Patron Customer</TableHead>
                <TableHead className="w-[130px] whitespace-nowrap">Fulfillment Status</TableHead>
                <TableHead className="w-[120px] whitespace-nowrap">Payment</TableHead>
                <TableHead className="w-[180px] whitespace-nowrap">Courier</TableHead>
                <TableHead className="w-[120px] whitespace-nowrap">Date</TableHead>
                <TableHead className="w-[110px] text-right whitespace-nowrap">Total Amount</TableHead>
                <TableHead className="w-[90px] text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center text-zinc-400 space-y-3">
                    <ShoppingBag className="w-9 h-9 mx-auto opacity-30 text-zinc-400" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        No orders found
                      </p>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto text-pretty">
                        No orders match the selected filters. Try searching for another term or clearing filters.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setCourierFilter("all");
                        setPaymentPendingFilter("all");
                        setCancelledReasonFilter("all");
                        setRefundStatusFilter("all");
                        handleTabChange("all");
                      }}
                      className="text-xs"
                    >
                      Clear filters
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => {
                  const badge = getStatusBadge(order.orderStatus);
                  const isCancelled = order.orderStatus === "cancelled";

                  return (
                    <TableRow
                      key={order.id}
                      className={`transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50 ${
                        isCancelled ? "bg-rose-50/20 dark:bg-rose-950/10" : ""
                      }`}
                    >
                      {/* Order ID */}
                      <TableCell className="whitespace-nowrap py-3.5">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono font-semibold text-xs text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 group"
                        >
                          <FileText className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                          <span className="tabular-nums tracking-tight font-bold">{order.id}</span>
                        </Link>
                      </TableCell>

                      {/* Customer */}
                      <TableCell className="py-3.5">
                        <Link
                          href={`/admin/customers/${order.customer.id}`}
                          className="group block min-w-0"
                        >
                          <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                            {order.customer.name}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono tabular-nums tracking-normal mt-0.5">
                            {order.customer.phone}
                          </div>
                        </Link>
                      </TableCell>

                      {/* Fulfillment Status */}
                      <TableCell className="whitespace-nowrap py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border shadow-2xs whitespace-nowrap",
                            badge.className
                          )}
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", badge.dotColor)} />
                          <span>{badge.label}</span>
                        </span>
                      </TableCell>

                      {/* Payment */}
                      <TableCell className="whitespace-nowrap py-3.5">
                        <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                          {order.paymentMethod === "bkash"
                            ? "bKash"
                            : order.paymentMethod === "card"
                            ? "Card"
                            : order.paymentMethod === "cod"
                            ? "COD"
                            : order.paymentMethod}
                        </div>
                        <div className="text-[10px] mt-0.5 flex items-center gap-1">
                          {order.paymentStatus === "paid" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              Paid
                            </span>
                          ) : order.paymentStatus === "refunded" ? (
                            <span className="text-zinc-400">Refunded</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                              <span className="w-1 h-1 rounded-full bg-amber-500" />
                              Unpaid
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Courier */}
                      <TableCell className="whitespace-nowrap py-3.5">
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {order.courier.toLowerCase().includes("in-house")
                            ? "In-House"
                            : order.courier.toLowerCase().includes("pathao")
                            ? "Pathao"
                            : order.courier.toLowerCase().includes("steadfast")
                            ? "Steadfast"
                            : order.courier.toLowerCase().includes("redx")
                            ? "RedX"
                            : order.courier.replace(" Priority", "")}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span>{order.shippingCity}</span>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-zinc-600 dark:text-zinc-400 font-mono text-xs whitespace-nowrap tabular-nums py-3.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>

                      {/* Total */}
                      <TableCell className="text-right font-mono font-bold text-xs text-zinc-950 dark:text-zinc-50 tabular-nums whitespace-nowrap py-3.5">
                        ৳{order.totalAmount.toLocaleString()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right whitespace-nowrap py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors shadow-2xs active:scale-[0.96]"
                          >
                            <Eye className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Invoice</span>
                          </Link>

                          {isCancelled && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Re-instate order ${order.id} to processing?`)) {
                                  updateOrderStatus(order.id, "processing");
                                }
                              }}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Re-instate order to active processing"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Pagination */}
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>
    </div>
  );
}
