"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCMS } from "@/context/cms-context";
import {
  AdminOrder,
  AdminOrderItem,
  AdminOrderStatus,
  AdminPaymentMethod,
  AdminPaymentStatus,
} from "@/data/admin-data";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ShoppingBag,
  User,
  Truck,
  CreditCard,
  FileText,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function NewOrderPage() {
  const router = useRouter();
  const { products, customers, addOrder } = useCMS();

  // Selected customer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ""
  );

  // Line items in order
  const [items, setItems] = useState<AdminOrderItem[]>([
    {
      productId: products[0]?.id || "prod-1",
      title: products[0]?.title || "Garment Item",
      image: products[0]?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
      category: products[0]?.category || "Fashion",
      price: products[0]?.price || 3500,
      quantity: 1,
      size: "M",
      color: "Noir Black",
    },
  ]);

  // Delivery & Payment
  const [deliveryCity, setDeliveryCity] = useState("Dhaka");
  const [deliveryAddress, setDeliveryAddress] = useState(
    customers[0]?.address || "House 42, Road 11, Banani"
  );
  const [courier, setCourier] = useState("Steadfast Express");
  const [paymentMethod, setPaymentMethod] =
    useState<AdminPaymentMethod>("bkash");
  const [paymentStatus, setPaymentStatus] =
    useState<AdminPaymentStatus>("paid");
  const [transactionId, setTransactionId] = useState("TRX-" + Date.now().toString().slice(-6));
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected customer object
  const activeCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Item management
  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setItems((prev) => [
      ...prev,
      {
        productId: prod.id,
        title: prod.title,
        image: prod.image,
        category: prod.category,
        price: prod.price,
        quantity: 1,
        size: "M",
        color: "Noir Black",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item))
    );
  };

  // Calculations
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = deliveryCity.toLowerCase() === "dhaka" ? 80 : 150;
  const discount = 0;
  const totalAmount = subtotal + deliveryFee - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !activeCustomer) return;

    setIsSubmitting(true);

    const generatedId = `ORD-2026-${Date.now().toString().slice(-4)}`;
    const newOrder: AdminOrder = {
      id: generatedId,
      customer: {
        id: activeCustomer.id,
        name: activeCustomer.name,
        email: activeCustomer.email,
        phone: activeCustomer.phone,
        avatar: activeCustomer.avatar,
        tier: activeCustomer.tier,
      },
      items,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      transactionId: transactionId || undefined,
      orderStatus: "processing",
      createdAt: new Date().toISOString().slice(0, 10),
      shippingAddress: deliveryAddress || activeCustomer.address,
      shippingCity: deliveryCity,
      courier,
      trackingCode: `STF-${Date.now().toString().slice(-6)}`,
      estimatedDelivery: "2-3 Business Days",
      timeline: [
        {
          title: "Order Logged Manually",
          time: "Just now",
          done: true,
          note: "Concierge telephone/showroom entry",
        },
        {
          title: "Payment Recorded",
          time: "Just now",
          done: paymentStatus === "paid",
          note: `${paymentMethod.toUpperCase()} transaction`,
        },
        {
          title: "Atelier Packaging",
          time: "Pending",
          done: false,
        },
      ],
      notes: orderNotes || undefined,
    };

    addOrder(newOrder);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/admin/orders/${generatedId}`);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to orders</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance">
            Create order
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            Create manual orders for showroom clients, phone requests, or direct purchases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="new-order-form"
            size="sm"
            disabled={isSubmitting || items.length === 0}
            className="gap-1.5 shadow-2xs"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? "Creating..." : "Create order"}</span>
          </Button>
        </div>
      </div>

      {/* 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Builder (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form
            id="new-order-form"
            onSubmit={handleSubmit}
            className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-6"
          >
            {/* 1. Customer Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    1. Customer details
                  </h3>
                </div>
                <Link
                  href="/admin/customers/new"
                  className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Register New</span>
                </Link>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Registered Patron
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    const c = customers.find((cust) => cust.id === e.target.value);
                    if (c) {
                      setDeliveryCity(c.city);
                      setDeliveryAddress(c.address);
                    }
                  }}
                  className="w-full h-10 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 cursor-pointer"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.phone} ({c.tier})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Order Line Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    2. Catalog Items & Garments
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  {items.length} items selected
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>{item.color}</span>
                          <span>•</span>
                          <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">
                            ৳{item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-950">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(index, item.quantity - 1)}
                          className="px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(index, item.quantity + 1)}
                          className="px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100 min-w-[70px] text-right">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add item selector */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Add another item from catalog:
                </label>
                <div className="flex gap-2">
                  <select
                    id="add-item-picker"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddItem(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="flex-1 h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="" disabled>
                      -- Choose product to add --
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} — ৳{p.price.toLocaleString()} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Delivery Destination & Courier */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <Truck className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  3. Shipping & Courier Assignment
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    City / Division
                  </label>
                  <select
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="Dhaka">Dhaka (Standard ৳80)</option>
                    <option value="Chittagong">Chittagong (Nationwide ৳150)</option>
                    <option value="Sylhet">Sylhet (Nationwide ৳150)</option>
                    <option value="Rajshahi">Rajshahi (Nationwide ৳150)</option>
                    <option value="Khulna">Khulna (Nationwide ৳150)</option>
                    <option value="Barisal">Barisal (Nationwide ৳150)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Assigned Courier Partner
                  </label>
                  <select
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="Steadfast Express">Steadfast Express (Next-Day)</option>
                    <option value="Pathao Courier">Pathao Courier</option>
                    <option value="RedX Logistics">RedX Logistics</option>
                    <option value="Paperfly">Paperfly</option>
                    <option value="Showroom Pickup">Direct Showroom Handover</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Full Delivery Address
                  </label>
                  <Input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <CreditCard className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  4. Payment Reconciliation
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as AdminPaymentMethod)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 uppercase font-mono"
                  >
                    <option value="bkash">bKash Merchant</option>
                    <option value="nagad">Nagad Direct</option>
                    <option value="card">Visa / Mastercard</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as AdminPaymentStatus)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 capitalize"
                  >
                    <option value="paid">Paid & Verified</option>
                    <option value="unpaid">Unpaid / Collect on Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Transaction Ref
                  </label>
                  <Input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <Link href="/admin/orders">
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || items.length === 0}
                className="gap-1.5 shadow-2xs"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? "Generating..." : "Place Order & Print Invoice"}</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Luxury Receipt Breakdown (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Live Order Invoice Preview</span>
            <Badge variant="outline" className="font-mono text-[10px]">
              Summary
            </Badge>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xs space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
              <div>
                <div className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400">
                  INSPIRE COUTURE ATELIER
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  Pro-Forma Showroom Invoice
                </div>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                Draft
              </Badge>
            </div>

            {/* Customer Pill */}
            {activeCustomer && (
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    <Image
                      src={activeCustomer.avatar}
                      alt={activeCustomer.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {activeCustomer.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {activeCustomer.phone}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {activeCustomer.tier}
                </Badge>
              </div>
            )}

            {/* Itemized list */}
            <div className="space-y-2 text-xs divide-y divide-zinc-100 dark:divide-zinc-900">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between pt-2 first:pt-0">
                  <div className="pr-2">
                    <div className="font-medium text-zinc-800 dark:text-zinc-200">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Qty: {item.quantity} • Size: {item.size}
                    </div>
                  </div>
                  <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Financials Breakdown */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-mono">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Courier Delivery ({courier})</span>
                <span className="font-mono">৳{deliveryFee.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Special VIP Discount</span>
                  <span className="font-mono">-৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                <span>Total Amount</span>
                <span className="font-mono text-base text-zinc-950 dark:text-white">
                  ৳{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Courier & Payment Summary */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-[11px] text-zinc-500 space-y-1">
              <div>
                <strong>Payment:</strong> {paymentMethod.toUpperCase()} ({paymentStatus})
              </div>
              <div>
                <strong>Ship To:</strong> {deliveryAddress}, {deliveryCity}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
