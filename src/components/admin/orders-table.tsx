"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminOrder, AdminOrderStatus } from "@/data/admin-data";
import { Search, Download, MoreVertical } from "lucide-react";
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

interface OrdersTableProps {
  orders: AdminOrder[];
  onUpdateOrderStatus?: (orderId: string, status: AdminOrderStatus) => void;
  externalSearch?: string;
  selectedOrderProp?: string | null;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onUpdateOrderStatus,
  externalSearch = "",
  selectedOrderProp,
}) => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  React.useEffect(() => {
    if (selectedOrderProp) {
      const found = orders.find((o) => o.id === selectedOrderProp);
      if (found) router.push(`/admin/orders/${found.id}`);
    }
  }, [selectedOrderProp, orders, router]);

  const query = (searchQuery || externalSearch).toLowerCase().trim();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;
      const matchQuery =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.phone.toLowerCase().includes(query) ||
        order.paymentMethod.toLowerCase().includes(query) ||
        order.shippingCity.toLowerCase().includes(query);

      return matchStatus && matchQuery;
    });
  }, [orders, statusFilter, query]);

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

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
    a.download = `orders-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeVariant = (status: AdminOrderStatus) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
      case "processing":
        return "secondary";
      case "pending":
        return "warning";
      case "cancelled":
        return "destructive";
    }
  };

  return (
    <div className="space-y-4">
      {/* Segmented Status Tabs (shadcn style) */}
      <div className="inline-flex p-1 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 text-xs overflow-x-auto max-w-full">
        {[
          { id: "all", label: "All orders", count: statusCounts.all },
          { id: "pending", label: "Pending", count: statusCounts.pending },
          { id: "processing", label: "Processing", count: statusCounts.processing },
          { id: "shipped", label: "Shipped", count: statusCounts.shipped },
          { id: "delivered", label: "Delivered", count: statusCounts.delivered },
          { id: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
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
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  isActive
                    ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800 font-semibold"
                    : "bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by customer, phone, or ID..."
            className="pl-8 text-xs h-9"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="self-start sm:self-auto gap-1.5 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Main DataTable */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pl-4 pr-2">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === filteredOrders.length
                  }
                  onChange={handleSelectAll}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
                />
              </TableHead>
              <TableHead className="w-[14%]">Order</TableHead>
              <TableHead className="w-[24%]">Customer</TableHead>
              <TableHead className="w-[14%]">Status</TableHead>
              <TableHead className="w-[16%]">Payment</TableHead>
              <TableHead className="w-[12%]">Date</TableHead>
              <TableHead className="text-right w-[12%]">Amount</TableHead>
              <TableHead className="text-right w-[10%] pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      No orders found
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      No customer orders match your search or status filter.
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
              filteredOrders.map((order) => {
                const isChecked = selectedIds.includes(order.id);
                return (
                  <TableRow
                    key={order.id}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className={`cursor-pointer ${
                      isChecked ? "bg-zinc-50 dark:bg-zinc-900/30" : ""
                    }`}
                  >
                    <TableCell
                      className="pl-4 pr-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="font-mono font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {order.customer.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono tabular-nums">
                        {order.customer.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.orderStatus) as any} className="capitalize text-[11px]">
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-zinc-700 dark:text-zinc-300">
                        {order.paymentMethod}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {order.shippingCity}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-500 font-mono text-[11px] tabular-nums">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      ৳{order.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="text-right pr-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors shadow-2xs"
                      >
                        <span>View order</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Footer Stats */}
        <div className="px-4 py-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong className="text-zinc-900 dark:text-zinc-100 tabular-nums">{filteredOrders.length}</strong> of{" "}
            <strong className="tabular-nums">{orders.length}</strong> orders
          </span>
          <span className="font-mono">
            Total revenue:{" "}
            <strong className="text-zinc-900 dark:text-zinc-100 tabular-nums">
              ৳
              {filteredOrders
                .reduce((acc, curr) => acc + curr.totalAmount, 0)
                .toLocaleString()}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
