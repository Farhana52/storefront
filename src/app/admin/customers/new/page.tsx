"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCMS } from "@/context/cms-context";
import { AdminCustomer, AdminCustomerTier } from "@/data/admin-data";
import {
  ArrowLeft,
  UserPlus,
  Crown,
  Phone,
  Mail,
  MapPin,
  Shield,
  FileText,
  Check,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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

const PRESET_AVATARS = [
  {
    label: "Portrait A",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Portrait B",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Portrait C",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Portrait D",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Portrait E",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },
];

export default function NewCustomerPage() {
  const router = useRouter();
  const { addCustomer } = useCMS();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+880 1");
  const [city, setCity] = useState("Dhaka");
  const [address, setAddress] = useState("");
  const [tier, setTier] = useState<AdminCustomerTier>("First-Time");
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);

    const generatedId = `CUST-${Date.now().toString().slice(-4)}`;
    const newCustomer: AdminCustomer = {
      id: generatedId,
      name: name.trim(),
      email:
        email.trim() ||
        `${name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@example.com`,
      phone: phone.trim(),
      city,
      address: address.trim() || `${city}, Bangladesh`,
      totalOrders: 0,
      lifetimeSpend: 0,
      tier,
      avatar,
      joinedDate: new Date().toISOString().slice(0, 10),
      lastActive: "Just registered",
      status: "active",
    };

    addCustomer(newCustomer);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/customers");
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customers</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            New customer
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Register a customer profile for showroom visits, phone orders, and deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/customers">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="new-customer-form"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : "Create customer"}</span>
          </Button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Form (7 Cols) */}
        <div className="lg:col-span-7">
          <form
            id="new-customer-form"
            onSubmit={handleSubmit}
            className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-6"
          >
            {/* Section 1: Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <Shield className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Contact information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Full name *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Begum Rokeya Sultana"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Mobile phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <Input
                      type="text"
                      required
                      placeholder="+880 1711-000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-8 text-xs h-9 font-mono tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <Input
                      type="email"
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-8 text-xs h-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Avatar Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Profile avatar
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(p.url)}
                    className={`relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      avatar === p.url
                        ? "border-zinc-950 dark:border-white ring-2 ring-zinc-950/20"
                        : "border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={p.url}
                      alt={p.label}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                    {avatar === p.url && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <Input
                type="text"
                placeholder="Or paste an image URL (optional)"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="text-xs h-8 text-zinc-600 dark:text-zinc-400 font-mono"
              />
            </div>

            {/* Section 3: Membership Tier */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Membership tier
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(
                  [
                    "First-Time",
                    "Silver Member",
                    "Gold Member",
                    "VIP Patron",
                  ] as AdminCustomerTier[]
                ).map((t) => {
                  const isSelected = tier === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTier(t)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.98] ${
                        isSelected
                          ? "border-zinc-950 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs font-semibold"
                          : "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs">{t}</div>
                      <div
                        className={`text-[10px] mt-1 ${
                          isSelected
                            ? "text-zinc-300 dark:text-zinc-600"
                            : "text-zinc-400"
                        }`}
                      >
                        {t === "VIP Patron"
                          ? "Complimentary styling"
                          : t === "Gold Member"
                          ? "Priority packaging"
                          : t === "Silver Member"
                          ? "Standard loyalty"
                          : "Welcome trial"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Delivery Destination */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Delivery destination
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    City / Division
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Detailed address
                  </label>
                  <Input
                    type="text"
                    placeholder="House, road, area, sector, postal code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Notes & Preferences */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Concierge notes & preferences
                </h3>
              </div>

              <textarea
                rows={3}
                placeholder="e.g. Prefers silk and modal finishes. Prefers delivery after 5 PM. Standard size M."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <Link href="/admin/customers">
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="gap-1.5 shadow-2xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? "Saving..." : "Create customer"}</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Live Customer Profile Card (5 Cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Profile preview</span>
            <Badge variant="outline" className="font-mono text-[10px]">
              Draft record
            </Badge>
          </div>

          {/* Luxury Atelier Customer Card */}
          <div className="rounded-2xl p-6 bg-linear-to-br from-zinc-900 via-zinc-950 to-black text-white shadow-xl border border-zinc-800/80 relative overflow-hidden space-y-6">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400">
                  INSPIRE ATELIER
                </div>
                <div className="text-xs font-mono text-zinc-500 mt-0.5">
                  PATRON DIRECTORY
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border border-amber-500/40 bg-amber-500/10 text-amber-300 flex items-center gap-1.5">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>{tier}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0 shadow-md">
                <Image
                  src={avatar}
                  alt={name || "Customer preview"}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="text-base font-bold text-white tracking-tight truncate">
                  {name || "Customer name"}
                </div>
                <div className="text-xs text-zinc-400 font-mono tabular-nums mt-0.5">
                  {phone || "+880 1700-000000"}
                </div>
                <div className="text-xs text-zinc-500 truncate mt-0.5">
                  {email || "customer@example.com"}
                </div>
              </div>
            </div>

            {/* Address & Account Strip */}
            <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-4 text-xs relative z-10">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                  Delivery city
                </div>
                <div className="font-semibold text-zinc-200 mt-0.5">
                  {city}, BD
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {address || "Address pending"}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                  Account status
                </div>
                <div className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </div>

            {/* Notes Callout */}
            {notes && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-zinc-300 relative z-10">
                <strong className="text-amber-300 block mb-0.5">
                  Preferences note:
                </strong>
                {notes}
              </div>
            )}
          </div>

          {/* Clean Helper Notice */}
          <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-xs text-zinc-500 space-y-1">
            <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span>Customer record</span>
            </div>
            <p className="leading-relaxed">
              Once created, this customer profile is available across orders, shipping consignments, and customer history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
