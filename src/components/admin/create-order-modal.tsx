"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCMS } from "@/context/cms-context";
import {
  AdminOrder,
  AdminOrderItem,
  AdminPaymentMethod,
  AdminOrderStatus,
} from "@/data/admin-data";
import {
  X,
  ShoppingBag,
  Plus,
  Trash2,
  User,
  CreditCard,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { customers, products, addOrder } = useCMS();

  // Customer selection
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "manual");
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("+880 1");
  const [manualCity, setManualCity] = useState("Dhaka");
  const [manualAddress, setManualAddress] = useState("");

  // Order Items
  const [orderItems, setOrderItems] = useState<AdminOrderItem[]>([
    {
      productId: products[0]?.id || "prod-1",
      title: products[0]?.title || "Festive Luxury Gown",
      image: products[0]?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
      category: products[0]?.category || "Fashion",
      price: products[0]?.price || 3500,
      quantity: 1,
      size: "M",
      color: "Noir Black",
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<AdminPaymentMethod>("cod");
  const [orderStatus, setOrderStatus] = useState<AdminOrderStatus>("processing");
  const [deliveryFee, setDeliveryFee] = useState<number>(120);
  const [discount, setDiscount] = useState<number>(0);

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId);

  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setOrderItems((prev) => [
      ...prev,
      {
        productId: prod.id,
        title: prod.title,
        image: prod.image,
        category: prod.category,
        price: prod.price,
        quantity: 1,
        size: "M",
        color: "Standard",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, qty: number) => {
    if (qty <= 0) return;
    setOrderItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
    );
  };

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) return;

    const customerData = currentCustomer
      ? {
          id: currentCustomer.id,
          name: currentCustomer.name,
          email: currentCustomer.email,
          phone: currentCustomer.phone,
          avatar: currentCustomer.avatar,
          tier: currentCustomer.tier,
        }
      : {
          id: `cust-${Date.now()}`,
          name: manualName || "Walk-in Patron",
          email: "concierge@inspirelifestyle.com",
          phone: manualPhone || "+880 1800-000000",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
          tier: "First-Time" as const,
        };

    const newOrder: AdminOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerData,
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "paid",
      orderStatus,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      shippingCity: currentCustomer ? currentCustomer.city : manualCity,
      shippingAddress: currentCustomer ? currentCustomer.address : manualAddress,
      courier: "Steadfast Courier",
      timeline: [
        {
          title: "Order Created by Concierge Admin",
          time: "Just now",
          done: true,
        },
      ],
    };

    addOrder(newOrder);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-2xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Create order
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Create a manual order for phone inquiries, WhatsApp, or walk-in customers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-5 text-xs">
          {/* Customer Selection */}
          <div className="p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                Customer destination
              </span>
              <button
                type="button"
                onClick={() =>
                  setSelectedCustomerId(selectedCustomerId === "manual" ? customers[0]?.id : "manual")
                }
                className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline cursor-pointer"
              >
                {selectedCustomerId === "manual" ? "Select registered customer" : "Enter new / walk-in customer"}
              </button>
            </div>

            {selectedCustomerId !== "manual" ? (
              <div>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) — {c.tier} — {c.city}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Customer name *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. Farzana Chowdhury"
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Contact phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Street delivery address
                  </label>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="e.g. Road 12, Gulshan 2"
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Order items ({orderItems.length})
              </span>

              {/* Add item dropdown */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddItem(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  + Add product
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — ৳{p.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
              {orderItems.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-800">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-xs">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono tabular-nums">
                        ৳{item.price.toLocaleString()} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                        className="px-2 py-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                        className="px-2 py-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 w-16 text-right tabular-nums">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-zinc-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
            <div className="space-y-2">
              <label className="block font-medium text-zinc-700 dark:text-zinc-300">
                Payment method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as AdminPaymentMethod)}
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
              >
                <option value="cod">Cash on delivery (COD)</option>
                <option value="bkash">bKash Merchant Pay</option>
                <option value="nagad">Nagad Direct</option>
                <option value="card">Visa / Mastercard / Amex</option>
              </select>

              <label className="block font-medium text-zinc-700 dark:text-zinc-300 pt-2">
                Workflow status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as AdminOrderStatus)}
                className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
              >
                <option value="pending">Pending confirmation</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400 font-mono text-[11px] self-end">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery fee:</span>
                <div className="flex items-center gap-1">
                  <span>৳</span>
                  <input
                    type="number"
                    min="0"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-16 px-1.5 py-0.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-right font-mono text-zinc-900 dark:text-zinc-100 tabular-nums"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>Discount:</span>
                <div className="flex items-center gap-1">
                  <span>-৳</span>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-16 px-1.5 py-0.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-right font-mono text-emerald-600 dark:text-emerald-400 tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-xs font-bold text-zinc-950 dark:text-zinc-50">
                <span>Total:</span>
                <span className="text-base text-zinc-950 dark:text-white tabular-nums">
                  ৳{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-white active:scale-[0.97] transition-transform duration-150 cursor-pointer shadow-xs"
            >
              Create order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
