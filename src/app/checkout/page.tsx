"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useCMS } from "@/context/cms-context";
import { AdminOrder } from "@/data/admin-data";
import { CheckoutFormData } from "@/types";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";
import { ShoppingBagIcon, ChevronDownIcon } from "@/components/ui/icons";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { coupons, addOrder } = useCMS();

  // Essential form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "",
    email: "",
    country: "Bangladesh",
    apartment: "",
    stateProvince: "",
    postalCode: "",
    subscribeNews: false,
    saveAddress: false,
    sameBillingAddress: true,
    deliveryMethod: "standard",
    paymentMethod: "cod",
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Promo code & order submission state
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [orderPlacementDate, setOrderPlacementDate] = useState("");
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Cached order snapshot for confirmation view
  const [orderSnapshot, setOrderSnapshot] = useState<{
    items: typeof items;
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    formData: CheckoutFormData;
  } | null>(null);

  // Discount calculation matching active CMS coupons
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    const match = coupons.find(
      (c) => c.code.toUpperCase() === appliedPromo.toUpperCase() && c.active
    );
    if (match) {
      if (match.minSpend && subtotal < match.minSpend) {
        return 0;
      }
      return Math.round((subtotal * match.discountPercent) / 100);
    }
    return 0;
  }, [appliedPromo, subtotal, coupons]);

  // Standard delivery fee (৳120)
  const shippingCost = items.length === 0 ? 0 : 120;
  const taxAmount = 0;
  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingCost);
  }, [subtotal, discountAmount, shippingCost]);

  // Field change handler
  const handleFieldChange = <K extends keyof CheckoutFormData>(
    field: K,
    value: CheckoutFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string): boolean => {
    let err = "";
    if (field === "fullName" && !formData.fullName.trim()) {
      err = "Please enter your full name.";
    } else if (field === "phone" && !formData.phone.trim()) {
      err = "Please enter your phone number.";
    } else if (field === "streetAddress" && !formData.streetAddress.trim()) {
      err = "Please enter your delivery address.";
    } else if (field === "city" && !formData.city.trim()) {
      err = "Please enter your city.";
    } else if (field === "email" && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        err = "Please enter a valid email address.";
      }
    }

    if (err) {
      setErrors((prev) => ({ ...prev, [field]: err }));
      return false;
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return true;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Please enter your full name.";
    if (!formData.phone.trim()) newErrors.phone = "Please enter your phone number.";
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Please enter your delivery address.";
    if (!formData.city.trim()) newErrors.city = "Please enter your city.";

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    setTouched({
      fullName: true,
      phone: true,
      streetAddress: true,
      city: true,
      email: true,
    });
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    const match = coupons.find(
      (c) => c.code.toUpperCase() === normalized && c.active
    );
    if (match) {
      if (match.minSpend && subtotal < match.minSpend) {
        return false;
      }
      setAppliedPromo(match.code);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handleSubmitOrder = () => {
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0] || "checkout-name";
      const el = document.getElementById(firstError);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    const orderNumber = `IL-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    setOrderSnapshot({
      items: [...items],
      subtotal,
      shippingCost,
      discountAmount,
      taxAmount,
      totalAmount,
      formData: { ...formData },
    });

    setConfirmedOrderId(orderNumber);
    setOrderPlacementDate(now);

    // Save order directly into Neon PostgreSQL database via API
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.fullName,
        customerEmail: formData.email || null,
        customerPhone: formData.phone,
        subtotal,
        deliveryFee: shippingCost,
        discount: discountAmount,
        totalAmount,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === "cod" ? "unpaid" : "paid",
        shippingAddress: `${formData.streetAddress}, ${formData.city}`,
        shippingCity: formData.city,
        courier: "Steadfast Express",
        items: items.map((it) => ({
          productId: it.product.id,
          title: it.product.title,
          price: it.product.price,
          quantity: it.quantity,
          size: it.selectedSize || "Standard",
          color: it.selectedColor || "Standard",
          image: it.product.image,
        })),
      }),
    })
      .then((res) => res.json())
      .then((createdOrder) => {
        if (createdOrder.orderNumber) {
          setConfirmedOrderId(createdOrder.orderNumber);
        }
      })
      .catch((e) => console.error("Order persistence failed:", e))
      .finally(() => {
        setIsSubmitting(false);
        setIsOrderPlaced(true);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  return (
    <div className="w-full bg-stone-50/50 dark:bg-zinc-950 transition-colors min-h-screen pb-20">
      {/* Page Title */}
      {!isOrderPlaced && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Checkout
          </h1>
        </div>
      )}

      {/* Confirmation View */}
      {isOrderPlaced && orderSnapshot ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderConfirmation
            orderId={confirmedOrderId}
            orderDate={orderPlacementDate}
            formData={orderSnapshot.formData}
            items={orderSnapshot.items}
            subtotal={orderSnapshot.subtotal}
            discountAmount={orderSnapshot.discountAmount}
            shippingCost={orderSnapshot.shippingCost}
            taxAmount={orderSnapshot.taxAmount}
            totalAmount={orderSnapshot.totalAmount}
            onResetCheckout={() => setIsOrderPlaced(false)}
          />
        </div>
      ) : items.length === 0 ? (
        /* Empty Cart View */
        <div className="max-w-md mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <ShoppingBagIcon size={28} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
            Your cart is empty
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 mb-6">
            Add some items to your bag before checking out.
          </p>
          <div className="flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-sm active:scale-[0.99]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        /* Two-Column Checkout Layout */
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Accordion */}
          <div className="lg:hidden mb-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setIsMobileSummaryOpen((prev) => !prev)}
              className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <ShoppingBagIcon size={15} />
                <span>{isMobileSummaryOpen ? "Hide order summary" : "Show order summary"}</span>
                <span className={`transform transition-transform ${isMobileSummaryOpen ? "rotate-180" : ""}`}>
                  <ChevronDownIcon size={13} />
                </span>
              </div>
              <span className="text-sm font-bold text-zinc-950 dark:text-white">
                ৳{totalAmount.toLocaleString()}
              </span>
            </button>

            {isMobileSummaryOpen && (
              <div className="p-4 pt-0 border-t border-zinc-100 dark:border-zinc-800">
                <CheckoutSummary
                  items={items}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  appliedPromo={appliedPromo}
                  discountAmount={discountAmount}
                  totalAmount={totalAmount}
                  isSubmitting={isSubmitting}
                  onApplyPromo={handleApplyPromo}
                  onRemovePromo={handleRemovePromo}
                  onSubmitOrder={handleSubmitOrder}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Delivery Details & Payment Method (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Delivery Details Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Delivery Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      placeholder="e.g. Alexander Vance"
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange("fullName", e.target.value)}
                      onBlur={() => handleFieldBlur("fullName")}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 ${
                        touched.fullName && errors.fullName
                          ? "border-rose-400 focus:ring-rose-500"
                          : "border-zinc-300 dark:border-zinc-700 focus:ring-zinc-950 dark:focus:ring-white"
                      }`}
                    />
                    {touched.fullName && errors.fullName && (
                      <p className="text-[11px] text-rose-500">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      placeholder="e.g. +1 555 019 2831"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      onBlur={() => handleFieldBlur("phone")}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 ${
                        touched.phone && errors.phone
                          ? "border-rose-400 focus:ring-rose-500"
                          : "border-zinc-300 dark:border-zinc-700 focus:ring-zinc-950 dark:focus:ring-white"
                      }`}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-[11px] text-rose-500">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-1">
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    Street / Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    placeholder="House, road, apartment or area details"
                    value={formData.streetAddress}
                    onChange={(e) => handleFieldChange("streetAddress", e.target.value)}
                    onBlur={() => handleFieldBlur("streetAddress")}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 ${
                      touched.streetAddress && errors.streetAddress
                        ? "border-rose-400 focus:ring-rose-500"
                        : "border-zinc-300 dark:border-zinc-700 focus:ring-zinc-950 dark:focus:ring-white"
                    }`}
                  />
                  {touched.streetAddress && errors.streetAddress && (
                    <p className="text-[11px] text-rose-500">{errors.streetAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div className="space-y-1">
                    <label
                      htmlFor="checkout-city"
                      className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      placeholder="e.g. New York or Dhaka"
                      value={formData.city}
                      onChange={(e) => handleFieldChange("city", e.target.value)}
                      onBlur={() => handleFieldBlur("city")}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 ${
                        touched.city && errors.city
                          ? "border-rose-400 focus:ring-rose-500"
                          : "border-zinc-300 dark:border-zinc-700 focus:ring-zinc-950 dark:focus:ring-white"
                      }`}
                    />
                    {touched.city && errors.city && (
                      <p className="text-[11px] text-rose-500">{errors.city}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label
                      htmlFor="checkout-email"
                      className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      Email Address <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      placeholder="e.g. patron@inspirelifestyle.com"
                      value={formData.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      onBlur={() => handleFieldBlur("email")}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white"
                    />
                    {touched.email && errors.email && (
                      <p className="text-[11px] text-rose-500">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cash on Delivery */}
                  <label
                    onClick={() => handleFieldChange("paymentMethod", "cod")}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "cod"
                        ? "border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800/60 ring-1 ring-zinc-950/20 dark:ring-white/20"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="pt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.paymentMethod === "cod"
                            ? "border-zinc-950 bg-zinc-950 dark:border-white dark:bg-white text-white dark:text-zinc-950"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      >
                        {formData.paymentMethod === "cod" && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-950" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-950 dark:text-white block">
                        Cash on Delivery
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Pay with cash upon receipt
                      </span>
                    </div>
                  </label>

                  {/* Online Payment */}
                  <label
                    onClick={() => handleFieldChange("paymentMethod", "card")}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "card"
                        ? "border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800/60 ring-1 ring-zinc-950/20 dark:ring-white/20"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="pt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.paymentMethod === "card"
                            ? "border-zinc-950 bg-zinc-950 dark:border-white dark:bg-white text-white dark:text-zinc-950"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      >
                        {formData.paymentMethod === "card" && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-950" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-950 dark:text-white block">
                        Pay Online / Card
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Cards or Digital Wallets
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Mobile In-flow Order Summary & Place Order Card */}
              <div className="lg:hidden bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-semibold text-zinc-950 dark:text-white font-mono">৳{subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount</span>
                      <span className="font-mono">-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span className="font-semibold text-zinc-950 dark:text-white">
                      {shippingCost === 0 ? "FREE" : `৳${shippingCost.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-zinc-950 dark:text-white">
                    <span className="text-sm font-bold">Total Payable</span>
                    <span className="text-xl font-extrabold font-mono">
                      ৳{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Mobile Order Button */}
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center hover:opacity-90 active:scale-[0.99] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Authorizing Order..." : "PLACE ORDER"}
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary for Desktop (5 Cols) */}
            <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24">
              <CheckoutSummary
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                appliedPromo={appliedPromo}
                discountAmount={discountAmount}
                totalAmount={totalAmount}
                isSubmitting={isSubmitting}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
                onSubmitOrder={handleSubmitOrder}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
