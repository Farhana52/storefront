"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Plus,
  AlertCircle,
  Copy,
  Check,
  MapPin,
  Phone,
  ShieldCheck,
  Settings2,
  Globe,
  Sliders,
  Gift,
  Printer,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/pagination";
import {
  INITIAL_COURIER_INTEGRATIONS,
  INITIAL_SHIPPING_ZONES,
  INITIAL_CONSIGNMENTS,
  CourierIntegration,
  ShippingZoneRate,
  ConsignmentItem,
} from "@/data/shipping-communications-data";

export default function AdminShippingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlTab = searchParams.get("tab") || "consignments";
  const [activeTab, setActiveTab] = useState<"consignments" | "integrations" | "zones">(
    urlTab === "integrations" || urlTab === "zones" ? urlTab : "consignments"
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "integrations" || tabParam === "zones" || tabParam === "consignments") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (key: "consignments" | "integrations" | "zones") => {
    setActiveTab(key);
    if (key === "consignments") {
      router.push("/admin/shipping");
    } else {
      router.push(`/admin/shipping?tab=${key}`);
    }
  };

  // State for Consignments
  const [consignments, setConsignments] = useState<ConsignmentItem[]>(INITIAL_CONSIGNMENTS);
  const [courierFilter, setCourierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [courierFilter, statusFilter, searchQuery]);

  // State for Couriers
  const [couriers, setCouriers] = useState<CourierIntegration[]>(INITIAL_COURIER_INTEGRATIONS);
  const [testingCourier, setTestingCourier] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  // State for Zones
  const [zones, setZones] = useState<ShippingZoneRate[]>(INITIAL_SHIPPING_ZONES);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(5000);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Copy tracking number
  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Test courier API connection
  const handleTestCourier = (id: string, name: string) => {
    setTestingCourier(id);
    setTestResult(null);
    setTimeout(() => {
      setTestingCourier(null);
      setTestResult({
        id,
        success: true,
        msg: `Connection verified. ${name} API handshake 200 OK. Webhook listener active.`,
      });
      setTimeout(() => setTestResult(null), 4000);
    }, 1200);
  };

  // Toggle courier enabled
  const toggleCourier = (id: string) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  // Update courier setting
  const updateCourierField = (id: string, field: keyof CourierIntegration, value: any) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Filtered consignments
  const filteredConsignments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return consignments.filter((c) => {
      const matchCourier =
        courierFilter === "all" ||
        c.courier.toLowerCase().includes(courierFilter.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchQuery =
        !q ||
        c.trackingCode.toLowerCase().includes(q) ||
        c.orderId.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.customerPhone.includes(q);

      return matchCourier && matchStatus && matchQuery;
    });
  }, [consignments, courierFilter, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredConsignments.length / pageSize) || 1;
  const paginatedConsignments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredConsignments.slice(start, start + pageSize);
  }, [filteredConsignments, currentPage, pageSize]);

  const inTransitCount = consignments.filter((c) => c.status === "In Transit" || c.status === "Out for Delivery").length;
  const deliveredCount = consignments.filter((c) => c.status === "Delivered").length;
  const activeCouriersCount = couriers.filter((c) => c.enabled).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance flex items-center gap-2.5">
            <span>Shipping</span>
            <Badge variant="outline" className="text-xs font-mono">
              APIs & zones
            </Badge>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Courier consignments, live tracking, API gateways, and delivery zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTestCourier("all", "All Couriers")}
            disabled={Boolean(testingCourier)}
            className="gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingCourier ? "animate-spin" : ""}`} />
            <span>Sync status</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-zinc-400" />
            Total consignments
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {consignments.length}
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-zinc-400" />
            In transit
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {inTransitCount}
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
            Delivered
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {deliveredCount}
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-zinc-400" />
            Active courier APIs
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {activeCouriersCount} of {couriers.length} connected
          </div>
        </Card>
      </div>

      {/* Main Tabs Segmented Bar */}
      <div className="inline-flex p-1 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 text-xs overflow-x-auto max-w-full">
        {[
          { key: "consignments", label: "Consignments", count: consignments.length, icon: Truck },
          { key: "integrations", label: "Courier integrations", icon: Settings2 },
          { key: "zones", label: "Delivery zones & rates", icon: MapPin },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key as any)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full tabular-nums ${isActive ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800 font-semibold" : "bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SHIPMENTS & CONSIGNMENTS */}
      {activeTab === "consignments" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Table Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracking code, order ID, phone..."
                className="pl-8 text-xs h-9"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Courier Filter */}
              <select
                value={courierFilter}
                onChange={(e) => setCourierFilter(e.target.value)}
                className="h-9 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                <option value="all">All Couriers</option>
                <option value="steadfast">Steadfast Express</option>
                <option value="pathao">Pathao Logistics</option>
                <option value="redx">RedX</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                <option value="all">All Delivery Statuses</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending Handover">Pending Handover</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          </div>

          {/* Consignments Table */}
          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%]">Tracking Code</TableHead>
                  <TableHead>Order ID & Date</TableHead>
                  <TableHead>Customer & Address</TableHead>
                  <TableHead className="text-right">COD Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredConsignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="max-w-xs mx-auto space-y-2">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          No shipments found
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          No consignments match your courier or status filters.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCourierFilter("all");
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
                  paginatedConsignments.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                            {c.trackingCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(c.trackingCode)}
                            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer p-0.5"
                            title="Copy tracking code"
                          >
                            {copiedId === c.trackingCode ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-indigo-500" />
                          <span>{c.courier}</span>
                          <span className="opacity-50">•</span>
                          <span className="font-mono tabular-nums">{c.weightKg} kg</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Link
                          href={`/admin/orders/${c.orderId}`}
                          className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline block tabular-nums"
                        >
                          {c.orderId}
                        </Link>
                        <div className="text-[11px] text-zinc-400 font-mono mt-0.5 tabular-nums">
                          {c.bookedAt}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {c.customerName}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-xs">
                          {c.customerAddress}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono tabular-nums">
                          {c.customerPhone}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                          {c.codAmount > 0 ? `৳${c.codAmount.toLocaleString()}` : "৳0 (Paid online)"}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {c.codAmount > 0 ? "Cash on delivery" : "Prepaid"}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant={
                            c.status === "Delivered"
                              ? "success"
                              : c.status === "In Transit" || c.status === "Out for Delivery"
                              ? "default"
                              : "outline"
                          }
                          className="text-[10px] capitalize whitespace-nowrap"
                        >
                          {c.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[11px] gap-1"
                            onClick={() => alert(`Printing official AWB slip for ${c.trackingCode}`)}
                          >
                            <Printer className="w-3 h-3 text-zinc-400" />
                            <span className="hidden sm:inline">Print slip</span>
                          </Button>
                          <Link href={`/admin/orders/${c.orderId}`}>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]">
                              View order
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Consignments Pagination */}
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredConsignments.length}
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
      )}

      {/* TAB 2: COURIER APIS & AUTOMATION */}
      {activeTab === "integrations" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {testResult && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{testResult.msg}</span>
              </div>
              <button
                type="button"
                onClick={() => setTestResult(null)}
                className="text-emerald-600 hover:text-emerald-900 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {couriers.map((courier) => (
              <div
                key={courier.id}
                className={`p-6 rounded-2xl border transition-all ${
                  courier.enabled
                    ? "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm"
                    : "border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/20 opacity-80"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 flex items-center justify-center text-zinc-700 dark:text-zinc-200">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <span>{courier.name}</span>
                        {courier.enabled && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        Provider: {courier.provider.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Enable Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courier.enabled}
                      onChange={() => toggleCourier(courier.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* API Fields */}
                <div className="space-y-4 pt-4 text-xs">
                  <div>
                    <label className="block text-zinc-500 font-medium mb-1">
                      API endpoint URL
                    </label>
                    <Input
                      type="text"
                      value={courier.baseUrl}
                      onChange={(e) => updateCourierField(courier.id, "baseUrl", e.target.value)}
                      className="text-xs font-mono h-8"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-500 font-medium mb-1">
                      Live API key
                    </label>
                    <Input
                      type="password"
                      value={courier.apiKey}
                      onChange={(e) => updateCourierField(courier.id, "apiKey", e.target.value)}
                      className="text-xs font-mono h-8"
                    />
                  </div>

                  {courier.secretKey !== undefined && (
                    <div>
                      <label className="block text-zinc-500 font-medium mb-1">
                        Secret key
                      </label>
                      <Input
                        type="password"
                        value={courier.secretKey}
                        onChange={(e) => updateCourierField(courier.id, "secretKey", e.target.value)}
                        className="text-xs font-mono h-8"
                      />
                    </div>
                  )}

                  {/* Automation Checkboxes */}
                  <div className="pt-2 space-y-2 border-t border-zinc-100 dark:border-zinc-900">
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={courier.autoConsignmentOnProcessing}
                        onChange={(e) =>
                          updateCourierField(courier.id, "autoConsignmentOnProcessing", e.target.checked)
                        }
                        className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Auto-book consignment when order is marked "Processing"</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={courier.autoSendTrackingSMS}
                        onChange={(e) =>
                          updateCourierField(courier.id, "autoSendTrackingSMS", e.target.checked)
                        }
                        className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Auto-send SMS with tracking link when courier picks up parcel</span>
                    </label>
                  </div>

                  {/* Courier Wallet Balance & Test Handshake */}
                  <div className="pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900">
                    <div className="font-mono text-zinc-500">
                      Wallet balance: <span className="font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">৳{courier.walletBalanceBDT.toLocaleString()}</span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestCourier(courier.id, courier.name)}
                      disabled={testingCourier === courier.id}
                      className="text-xs h-8 gap-1.5 shadow-2xs"
                    >
                      <RefreshCw className={`w-3 h-3 ${testingCourier === courier.id ? "animate-spin" : ""}`} />
                      <span>Test connection</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DELIVERY ZONES & RATES */}
      {activeTab === "zones" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {isSavedNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Shipping zones and free delivery threshold saved successfully!</span>
            </div>
          )}

          {/* Global Threshold Policy */}
          <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-balance">
                  <Gift className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <span>Free shipping threshold</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
                  Orders exceeding this subtotal qualify for complimentary courier delivery across Bangladesh.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">৳</span>
                <Input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-32 text-xs font-mono font-bold h-9 tabular-nums"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    setIsSavedNotice(true);
                    setTimeout(() => setIsSavedNotice(false), 3000);
                  }}
                  className="shadow-2xs text-xs h-9"
                >
                  Save changes
                </Button>
              </div>
            </div>
          </div>

          {/* Zones Table */}
          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Delivery zones & rates
              </h3>
              <span className="text-[11px] text-zinc-400 tabular-nums">
                {zones.length} delivery regions active
              </span>
            </div>

            <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
              {zones.map((zone) => (
                <div key={zone.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {zone.name}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono tabular-nums">
                        {zone.estimatedDelivery}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {zone.regions}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div>
                      <span className="text-zinc-400 block text-[10px]">Standard delivery</span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        ৳{zone.standardFee}
                      </span>
                    </div>

                    {zone.expressFee && (
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Same-day express</span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                          ৳{zone.expressFee}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-zinc-400 block text-[10px]">COD surcharge</span>
                      <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tabular-nums">
                        {zone.codFee > 0 ? `৳${zone.codFee}` : "Free"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
