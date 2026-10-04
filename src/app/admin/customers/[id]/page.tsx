"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCMS } from "@/context/cms-context";
import { AdminCustomer, AdminCustomerTier } from "@/data/admin-data";
import {
  ArrowLeft,
  Crown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShoppingBag,
  TrendingUp,
  FileText,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Shield,
  Edit3,
  Activity,
  Laptop,
  Smartphone,
  Globe,
  Wifi,
  KeyRound,
  Eye,
  Star,
  CheckCircle2,
  Tag,
  AlertCircle,
  Truck,
  CreditCard,
  Bookmark,
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

const CITIES = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Comilla",
  "Gazipur",
  "Narayanganj",
];

// Rich simulated login security history
const LOGIN_SECURITY_SESSIONS = [
  {
    id: "sess-1",
    timestamp: "Oct 04, 2026 · 01:14 PM",
    ip: "103.114.98.24",
    location: "Banani, Dhaka, Bangladesh",
    isp: "Fiber@Home Metro Fiber",
    device: "Apple iPhone 16 Pro",
    deviceType: "mobile",
    browser: "Mobile Safari 18.2",
    status: "Active Current Session",
    twoFactor: "Verified via SMS OTP",
  },
  {
    id: "sess-2",
    timestamp: "Oct 02, 2026 · 08:42 PM",
    ip: "103.114.98.24",
    location: "Banani, Dhaka, Bangladesh",
    isp: "Fiber@Home Metro Fiber",
    device: "MacBook Pro 16\" (M3 Max)",
    deviceType: "desktop",
    browser: "Chrome 129.0 (macOS)",
    status: "Terminated (Logged out)",
    twoFactor: "Biometric Passkey",
  },
  {
    id: "sess-3",
    timestamp: "Sep 28, 2026 · 11:20 AM",
    ip: "203.76.128.45",
    location: "Gulshan-2, Dhaka, Bangladesh",
    isp: "Grameenphone 5G LTE",
    device: "Apple iPhone 16 Pro",
    deviceType: "mobile",
    browser: "Mobile Safari 18.2",
    status: "Expired Session",
    twoFactor: "Verified via SMS OTP",
  },
  {
    id: "sess-4",
    timestamp: "Sep 15, 2026 · 04:15 PM",
    ip: "103.205.71.12",
    location: "Nasirabad, Chittagong, Bangladesh",
    isp: "Link3 Technologies",
    device: "iPad Pro 13\" (M4)",
    deviceType: "tablet",
    browser: "Safari 18.0 (iPadOS)",
    status: "Expired Session",
    twoFactor: "Biometric Passkey",
  },
];

// Comprehensive A-to-Z patron audit trail
const PATRON_AUDIT_LOG = [
  {
    id: "aud-8",
    time: "Today, 01:14 PM",
    title: "Patron Authenticated via Mobile",
    description: "Successful login from IP 103.114.98.24 via Safari on iOS 18.2.",
    icon: KeyRound,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "aud-7",
    time: "Yesterday, 04:30 PM",
    title: "Showroom Courier Delivery Confirmed",
    description: "Package received at Banani residence. Delivery acknowledged by patron.",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "aud-6",
    time: "Oct 02, 2026 · 09:15 AM",
    title: "Dispatched with Steadfast Express",
    description: "Tracking code STF-992104 assigned. Handed over to courier hub.",
    icon: Truck,
    color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800",
  },
  {
    id: "aud-5",
    time: "Oct 01, 2026 · 08:45 PM",
    title: "Order Placed & bKash Paid",
    description: "Placed order for Tailored Virgin Wool Blazer. Transaction verified (৳3,530).",
    icon: ShoppingBag,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
  },
  {
    id: "aud-4",
    time: "Oct 01, 2026 · 08:38 PM",
    title: "VIP Promo Applied",
    description: "Applied voucher code INSPIRE2026 for complimentary atelier courier delivery.",
    icon: Tag,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800",
  },
  {
    id: "aud-3",
    time: "Oct 01, 2026 · 08:22 PM",
    title: "Browsed Lookbook & Silhouette Details",
    description: "Inspected fabric weight & garment specifications for 3 bespoke dresses.",
    icon: Eye,
    color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800",
  },
  {
    id: "aud-2",
    time: "Sep 20, 2026 · 11:00 AM",
    title: "Concierge Styling Note Added",
    description: "Admin logged sizing preference: Size M, preference for modest silk wraps.",
    icon: Bookmark,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
  },
  {
    id: "aud-1",
    time: "Joined April 2025",
    title: "Registered Atelier Patron Account",
    description: "Verified mobile number with primary delivery address in Banani, Dhaka.",
    icon: Shield,
    color: "text-zinc-600 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700",
  },
];

export default function CustomerProfilePage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = params ? use(params) : null;
  const clientParams = useParams();
  const customerId = resolvedParams?.id || (clientParams?.id as string) || "";

  const { customers, updateCustomer, deleteCustomer, orders } = useCMS();

  // Active view tab synced with URL ?tab=...
  const urlTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "audit" | "security"
  >(
    urlTab && ["overview", "orders", "audit", "security"].includes(urlTab)
      ? (urlTab as any)
      : "overview"
  );

  useEffect(() => {
    if (urlTab && ["overview", "orders", "audit", "security"].includes(urlTab)) {
      setActiveTab(urlTab as any);
    }
  }, [urlTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as any);
    if (key === "overview") {
      router.push(`/admin/customers/${customerId}`);
    } else {
      router.push(`/admin/customers/${customerId}?tab=${key}`);
    }
  };

  // Find customer
  const customer = customers.find(
    (c) => c.id === customerId || c.id === `cust-${customerId}`
  );

  // Editable Form State
  const [formData, setFormData] = useState<Partial<AdminCustomer>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        address: customer.address,
        tier: customer.tier,
        avatar: customer.avatar,
      });
    }
  }, [customer]);

  if (!customer) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Patron Profile Not Found
        </h2>
        <p className="text-sm text-zinc-500">
          The requested customer record (ID: {customerId}) does not exist.
        </p>
        <Link href="/admin/customers">
          <Button variant="outline" size="sm">
            Back to Customers
          </Button>
        </Link>
      </div>
    );
  }

  // Find all orders placed by this customer
  const customerOrders = orders.filter(
    (o) =>
      o.customer.id === customer.id ||
      o.customer.email.toLowerCase() === customer.email.toLowerCase() ||
      o.customer.name.toLowerCase() === customer.name.toLowerCase()
  );

  const totalCalculatedSpend =
    customerOrders.length > 0
      ? customerOrders.reduce((acc, o) => acc + o.totalAmount, 0)
      : customer.lifetimeSpend;

  const totalOrdersCount = Math.max(
    customerOrders.length,
    customer.totalOrders
  );

  const avgOrderValue =
    totalOrdersCount > 0
      ? Math.round(totalCalculatedSpend / totalOrdersCount)
      : 0;

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    updateCustomer(customer.id, {
      ...formData,
    });

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 200);
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to permanently delete customer account for "${customer.name}"?`
      )
    ) {
      deleteCustomer(customer.id);
      router.push("/admin/customers");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to customers</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
              {customer.name}
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-mono border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
            >
              <Crown className="w-3 h-3 mr-1 text-amber-500" />
              <span>{customer.tier}</span>
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${customer.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-zinc-500" />
            <span>Call customer</span>
          </a>

          <a
            href={`mailto:${customer.email}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-zinc-500" />
            <span>Send email</span>
          </a>

          <Link href="/admin/orders/new">
            <Button size="sm" className="gap-1.5 shadow-2xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Create order</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
            title="Delete customer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Patron Profile Summary Card */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={customer.avatar}
                alt={customer.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-500">
                  {customer.id}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {customer.tier}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {customer.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  {customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  {customer.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {customer.city}, Bangladesh
                </span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>Registered: {customer.joinedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Last active: {customer.lastActive}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Row (Clean Neutral Surfaces) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
            Total orders
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {totalOrdersCount}
          </div>
          <div className="text-[10px] text-zinc-400">
            Completed purchases
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
            Lifetime spend
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            ৳{totalCalculatedSpend.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-400">
            Total contribution
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
            Average order
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            ৳{avgOrderValue.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-400">
            Per transaction
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Tier status
          </span>
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-50 pt-0.5 truncate">
            {customer.tier}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            VIP Priority Dispatch
          </div>
        </div>
      </div>

      {/* Nav Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs">
        {[
          { key: "overview", label: "Profile & settings", icon: Edit3 },
          { key: "orders", label: `Orders (${customerOrders.length})`, icon: ShoppingBag },
          { key: "audit", label: "Activity trail", icon: Activity },
          { key: "security", label: "Security & sessions", icon: Shield },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 360° Profile & Edit */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-150">
          {/* Left Column: Edit Profile Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Update customer records
                  </h3>
                </div>
                {saveSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Saved successfully
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveChanges} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Customer full name
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="text-xs h-9"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Mobile phone number
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="text-xs h-9 font-mono tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Email address
                    </label>
                    <Input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="text-xs h-9"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      City / division
                    </label>
                    <select
                      value={formData.city || "Dhaka"}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Membership tier
                    </label>
                    <select
                      value={formData.tier || "First-Time"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tier: e.target.value as AdminCustomerTier,
                        })
                      }
                      className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="First-Time">First-time</option>
                      <option value="Silver Member">Silver member</option>
                      <option value="Gold Member">Gold member</option>
                      <option value="VIP Patron">VIP member</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Delivery address
                    </label>
                    <Input
                      type="text"
                      value={formData.address || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Avatar image URL
                    </label>
                    <Input
                      type="text"
                      value={formData.avatar || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, avatar: e.target.value })
                      }
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSaving}
                    className="gap-1.5 shadow-2xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : "Save changes"}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Concierge Notes & Highlights (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Concierge Preferences
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400">
                  VIP Notes
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60 text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
                <div className="font-semibold text-amber-900 dark:text-amber-200">
                  Sizing & Fabric Directives:
                </div>
                <p className="leading-relaxed text-[11px]">
                  Prefers Italian virgin wool and modal silk finishes. Typically wears standard Size M (Free Size for scarves). Requests evening deliveries after 6 PM.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 space-y-2">
                <div className="flex justify-between">
                  <span>Assigned Concierge:</span>
                  <strong className="text-zinc-900 dark:text-zinc-100">Senior Atelier Stylist</strong>
                </div>
                <div className="flex justify-between">
                  <span>Courier Preference:</span>
                  <strong className="text-zinc-900 dark:text-zinc-100">Steadfast Priority Express</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payment Preference:</span>
                  <strong className="text-zinc-900 dark:text-zinc-100">bKash Merchant Direct</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders & Invoices History */}
      {activeTab === "orders" && (
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-3 flex-wrap">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Purchases & Transactions History
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                All omnichannel invoices and dispatch records for {customer.name}.
              </p>
            </div>
            <Link href="/admin/orders/new" className="shrink-0">
              <Button size="sm" className="gap-1.5 shadow-2xs whitespace-nowrap text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Create order</span>
              </Button>
            </Link>
          </div>

          {customerOrders.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-30 text-zinc-400" />
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                No orders recorded for this patron yet.
              </p>
              <Link href="/admin/orders/new">
                <Button variant="outline" size="sm" className="text-xs">
                  Generate First Showroom Order
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-x-auto shadow-2xs">
              <Table className="min-w-[680px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[16%]">Order ID</TableHead>
                    <TableHead className="w-[14%]">Date</TableHead>
                    <TableHead className="w-[14%]">Status</TableHead>
                    <TableHead className="w-[24%]">Items purchased</TableHead>
                    <TableHead className="w-[14%]">Payment</TableHead>
                    <TableHead className="w-[10%] text-right">Total amount</TableHead>
                    <TableHead className="w-[8%] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerOrders.map((ord) => (
                    <TableRow key={ord.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors">
                      <TableCell>
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:underline tabular-nums"
                        >
                          {ord.id}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-zinc-500 dark:text-zinc-400 text-[11px] tabular-nums whitespace-nowrap">
                        {ord.createdAt}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${
                            ord.orderStatus === "delivered"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60"
                              : ord.orderStatus === "processing"
                              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60"
                              : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-700 dark:text-zinc-300 max-w-xs truncate font-medium">
                        {ord.items.map((i) => `${i.title} (${i.quantity})`).join(", ")}
                      </TableCell>
                      <TableCell>
                        <div className="text-[11px] font-mono font-semibold uppercase text-zinc-900 dark:text-zinc-100">
                          {ord.paymentMethod}
                        </div>
                        <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 capitalize">
                          {ord.paymentStatus}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-xs sm:text-sm text-zinc-950 dark:text-zinc-50 tabular-nums">
                        ৳{ord.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${ord.id}`}>
                          <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px] shadow-2xs">
                            Invoice
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Full A-to-Z Activity & Audit Trail (The user requested this specifically) */}
      {activeTab === "audit" && (
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Patron Activity & Telemetry Audit Trail (A to Z)</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Every action taken by {customer.name} since registration, from browsing to payment and review.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              8 Verified Audit Events
            </Badge>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
            {PATRON_AUDIT_LOG.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative flex items-start gap-4">
                  {/* Timeline icon node */}
                  <div
                    className={`absolute -left-6 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border text-xs shadow-2xs ${item.color}`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>

                  {/* Content card */}
                  <div className="flex-1 p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Login & Device Security Sessions (IP Address, Device, Network, ISP) */}
      {activeTab === "security" && (
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>Patron Device Sessions & IP Security Audit</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Verified login sessions, client IP addresses, internet service providers (ISP), and device fingerprints.
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              4 Recorded Sessions
            </Badge>
          </div>

          {/* Sessions Table */}
          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Session date & time</TableHead>
                  <TableHead className="w-[14%]">IP address</TableHead>
                  <TableHead className="w-[22%]">Location & ISP</TableHead>
                  <TableHead className="w-[20%]">Device & browser</TableHead>
                  <TableHead className="w-[14%]">Authentication</TableHead>
                  <TableHead className="w-[10%] text-right">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {LOGIN_SECURITY_SESSIONS.map((sess) => {
                  const isCurrent = sess.status.includes("Active");
                  return (
                    <TableRow
                      key={sess.id}
                      className={
                        isCurrent ? "bg-emerald-50/30 dark:bg-emerald-950/15" : ""
                      }
                    >
                      {/* Timestamp */}
                      <TableCell className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{sess.timestamp}</span>
                        </div>
                      </TableCell>

                      {/* IP Address */}
                      <TableCell>
                        <div className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md inline-block">
                          {sess.ip}
                        </div>
                      </TableCell>

                      {/* Location & ISP */}
                      <TableCell>
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          <span>{sess.location}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Wifi className="w-3 h-3" />
                          <span>{sess.isp}</span>
                        </div>
                      </TableCell>

                      {/* Device & Browser */}
                      <TableCell>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          {sess.deviceType === "mobile" ? (
                            <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5 text-zinc-500" />
                          )}
                          <span>{sess.device}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {sess.browser}
                        </div>
                      </TableCell>

                      {/* Authentication */}
                      <TableCell>
                        <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                          {sess.twoFactor}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-right">
                        <Badge
                          variant={isCurrent ? "success" : "outline"}
                          className="text-[10px]"
                        >
                          {sess.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
