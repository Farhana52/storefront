"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useCMS } from "@/context/cms-context";
import { AdminCustomer, AdminCustomerTier } from "@/data/admin-data";
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Eye,
  Trash2,
  Crown,
  CreditCard,
  TrendingUp,
  MapPin,
  Mail,
  ShieldCheck,
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

export default function AdminCustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customers, deleteCustomer } = useCMS();

  const urlTier = searchParams.get("tier") || "all";
  const [selectedTier, setSelectedTier] = useState<string>(urlTier);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const param = searchParams.get("tier") || "all";
    setSelectedTier(param);
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleTierChange = (tierKey: string) => {
    setSelectedTier(tierKey);
    if (tierKey === "all") {
      router.push("/admin/customers");
    } else if (tierKey === "VIP Patron" || tierKey === "vip") {
      router.push("/admin/customers?tier=vip");
    } else if (tierKey === "First-Time" || tierKey === "first") {
      router.push("/admin/customers?tier=first");
    } else {
      router.push(`/admin/customers?tier=${encodeURIComponent(tierKey)}`);
    }
  };

  const query = searchQuery.toLowerCase().trim();

  // Tier counts
  const tierCounts = useMemo(() => {
    return {
      all: customers.length,
      vip: customers.filter((c) => c.tier === "VIP Patron" || c.tier === "Gold Member").length,
      "VIP Patron": customers.filter((c) => c.tier === "VIP Patron").length,
      "Gold Member": customers.filter((c) => c.tier === "Gold Member").length,
      "Silver Member": customers.filter((c) => c.tier === "Silver Member").length,
      "First-Time": customers.filter((c) => c.tier === "First-Time").length,
    };
  }, [customers]);

  // Aggregate stats
  const totalSpend = useMemo(() => {
    return customers.reduce((sum, c) => sum + (c.lifetimeSpend || 0), 0);
  }, [customers]);

  const avgSpend = useMemo(() => {
    if (customers.length === 0) return 0;
    return Math.round(totalSpend / customers.length);
  }, [customers, totalSpend]);

  const vipCount = tierCounts["vip"];

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      let matchTier = true;
      if (selectedTier === "vip") {
        matchTier = customer.tier === "VIP Patron" || customer.tier === "Gold Member";
      } else if (selectedTier === "first") {
        matchTier = customer.tier === "First-Time";
      } else if (selectedTier !== "all") {
        matchTier = customer.tier === selectedTier;
      }

      const matchQuery =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.city.toLowerCase().includes(query);

      return matchTier && matchQuery;
    });
  }, [customers, selectedTier, query]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const getTierBadge = (tier: AdminCustomerTier) => {
    switch (tier) {
      case "VIP Patron":
        return "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
      case "Gold Member":
        return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Silver Member":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
      case "First-Time":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            Customers
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Manage customer accounts, purchase history, delivery addresses, and membership tiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/customers/new">
            <Button size="sm" className="gap-1.5 shadow-2xs">
              <UserPlus className="w-4 h-4" />
              <span>Register customer</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/customers"
          className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            Total customers
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {customers.length}
          </div>
        </Link>

        <Link
          href="/admin/customers?tier=vip"
          className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-zinc-400" />
            VIP & Gold members
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {vipCount}
          </div>
        </Link>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
            Total customer spend
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            ৳{totalSpend.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
            Average lifetime value
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            ৳{avgSpend.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tier Filter Pills (shadcn segmented control style) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs">
        {[
          { key: "all", label: "All customers" },
          { key: "vip", label: "VIP & Gold" },
          { key: "VIP Patron", label: "VIP members" },
          { key: "Gold Member", label: "Gold members" },
          { key: "Silver Member", label: "Silver members" },
          { key: "first", label: "First-time buyers" },
        ].map((tab) => {
          const isActive =
            selectedTier === tab.key ||
            (tab.key === "first" && selectedTier === "First-Time") ||
            (tab.key === "VIP Patron" && selectedTier === "VIP Patron");
          const count = tierCounts[tab.key as keyof typeof tierCounts] ?? 0;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTierChange(tab.key)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  isActive
                    ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800 font-semibold"
                    : "bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {count}
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
            placeholder="Search by name, phone, email, or city..."
            className="pl-8 text-xs h-9"
          />
        </div>

        <div className="text-xs text-zinc-500 font-mono tabular-nums">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>

      {/* Main Customers DataTable */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[36%]">Customer</TableHead>
              <TableHead className="w-[18%]">Phone</TableHead>
              <TableHead className="w-[14%]">City</TableHead>
              <TableHead className="w-[12%] text-center">Orders</TableHead>
              <TableHead className="w-[18%] text-right">Lifetime Spend</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-zinc-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No customers found</p>
                  <p className="text-xs mt-1 text-zinc-500">
                    No customer records match your filter criteria.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        handleTierChange("all");
                      }}
                      className="text-xs"
                    >
                      Clear filters
                    </Button>
                    <Link href="/admin/customers/new">
                      <Button size="sm" className="text-xs">
                        Register customer
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((cust) => (
                <TableRow key={cust.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors">
                  {/* Patron Profile: Name, Tier Badge, and Email */}
                  <TableCell>
                    <Link
                      href={`/admin/customers/${cust.id}`}
                      className="flex items-center gap-3 group/link"
                    >
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/80 dark:border-zinc-800 group-hover/link:ring-2 group-hover/link:ring-zinc-900/10 dark:group-hover/link:ring-zinc-100/10 transition-all">
                        <Image
                          src={cust.avatar}
                          alt={cust.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 group-hover/link:underline truncate">
                            {cust.name}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-medium border shrink-0 ${getTierBadge(
                              cust.tier
                            )}`}
                          >
                            {cust.tier}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                          {cust.email}
                        </div>
                      </div>
                    </Link>
                  </TableCell>

                  {/* Phone */}
                  <TableCell>
                    <a
                      href={`tel:${cust.phone}`}
                      className="font-mono text-xs text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white tabular-nums"
                    >
                      {cust.phone}
                    </a>
                  </TableCell>

                  {/* City */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="truncate">{cust.city}</span>
                    </div>
                  </TableCell>

                  {/* Orders */}
                  <TableCell className="text-center">
                    <span className="font-mono font-semibold text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md tabular-nums">
                      {cust.totalOrders}
                    </span>
                  </TableCell>

                  {/* Lifetime Spend */}
                  <TableCell className="text-right">
                    <div className="font-mono font-bold text-xs text-zinc-950 dark:text-zinc-50 tabular-nums">
                      ৳{cust.lifetimeSpend.toLocaleString()}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/customers/${cust.id}`}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="View 360° profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={`tel:${cust.phone}`}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Call customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete customer account for "${cust.name}"?`)) {
                            deleteCustomer(cust.id);
                          }
                        }}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Table Pagination */}
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCustomers.length}
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
