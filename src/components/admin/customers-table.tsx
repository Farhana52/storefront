"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { AdminCustomer, AdminCustomerTier } from "@/data/admin-data";
import { Search, Phone, Mail, MapPin } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface CustomersTableProps {
  customers: AdminCustomer[];
  externalSearch?: string;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  externalSearch = "",
}) => {
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const query = (searchQuery || externalSearch).toLowerCase().trim();

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchTier =
        selectedTier === "all" || customer.tier === selectedTier;
      const matchQuery =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.city.toLowerCase().includes(query);

      return matchTier && matchQuery;
    });
  }, [customers, selectedTier, query]);

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
    <div className="space-y-3">
      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            />
          </div>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="VIP Patron">VIP Patron</option>
            <option value="Gold Member">Gold Member</option>
            <option value="Silver Member">Silver Member</option>
            <option value="First-Time">First-Time</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Customer</TableHead>
              <TableHead className="w-[16%]">Tier</TableHead>
              <TableHead className="w-[16%]">Phone</TableHead>
              <TableHead className="w-[14%]">City</TableHead>
              <TableHead className="w-[10%]">Orders</TableHead>
              <TableHead className="w-[14%] text-right">Lifetime spend</TableHead>
              <TableHead className="w-[10%] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-zinc-500">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No customers found</p>
                  <p className="text-xs text-zinc-500 mt-1">Try searching with a different name, email, or phone number.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((cust) => (
                <TableRow
                  key={cust.id}
                  className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/60 dark:border-zinc-800/60">
                        <Image
                          src={cust.avatar}
                          alt={cust.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {cust.name}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {cust.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getTierBadge(
                        cust.tier
                      )}`}
                    >
                      {cust.tier}
                    </span>
                  </TableCell>

                  <TableCell className="font-mono text-zinc-600 dark:text-zinc-400 tabular-nums">
                    {cust.phone}
                  </TableCell>

                  <TableCell className="text-zinc-600 dark:text-zinc-400">
                    {cust.city}
                  </TableCell>

                  <TableCell className="font-mono font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {cust.totalOrders}
                  </TableCell>

                  <TableCell className="text-right font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    ৳{cust.lifetimeSpend.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <a
                      href={`tel:${cust.phone}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors active:scale-[0.96] shadow-2xs"
                      aria-label={`Call ${cust.name}`}
                    >
                      <Phone className="w-3 h-3 text-zinc-500" />
                      <span>Call</span>
                    </a>
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
