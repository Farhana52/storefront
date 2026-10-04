"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Edit3, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { PatronAddress } from "../types";
import { AddressModal } from "./address-modal";
import { useAuth } from "@/context/auth-context";

export const AddressesView: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<PatronAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<PatronAddress | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const email = user?.email || "farhana@inspire.com";
      const phone = user?.phone || "+880 1711-234567";
      const res = await fetch(`/api/customer/addresses?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.addresses)) {
          setAddresses(data.addresses);
        }
      }
    } catch (err) {
      console.error("Failed to load patron addresses:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: PatronAddress) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch(`/api/customer/addresses?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete address:", err);
      fetchAddresses();
    }
  };

  const handleSetDefault = async (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    try {
      await fetch("/api/customer/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true }),
      });
    } catch (err) {
      console.error("Failed to set default address:", err);
      fetchAddresses();
    }
  };

  const handleSave = async (addressData: Omit<PatronAddress, "id">, editId?: string) => {
    try {
      if (editId) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === editId ? { ...addressData, id: editId } : a))
        );
        await fetch("/api/customer/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...addressData }),
        });
      } else {
        const res = await fetch("/api/customer/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...addressData,
            email: user?.email || "farhana@inspire.com",
            phone: user?.phone || "+880 1711-234567",
          }),
        });
        if (res.ok) {
          const created = await res.json();
          setAddresses((prev) => [created, ...prev]);
        }
      }
    } catch (err) {
      console.error("Failed to save address:", err);
    } finally {
      fetchAddresses();
    }
  };

  return (
    <section aria-label="Patron Delivery Addresses" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Delivery Addresses
          </h2>
        </div>

        <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 cursor-pointer min-h-[38px]">
          <Plus className="w-4 h-4" />
          <span>Add address</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-zinc-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-mono">Loading saved addresses...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <article
              key={addr.id}
              aria-labelledby={`address-${addr.id}`}
              className={`p-5 rounded-2xl border transition-all ${
                addr.isDefault
                  ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/40 shadow-xs"
                  : "bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      addr.isDefault
                        ? "bg-amber-500 text-zinc-950"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3
                      id={`address-${addr.id}`}
                      className="text-sm font-bold text-zinc-950 dark:text-white"
                    >
                      {addr.label}
                    </h3>
                    <p className="text-xs text-zinc-500">{addr.recipientName}</p>
                  </div>
                </div>

                {addr.isDefault ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Default
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    Make default
                  </button>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                <p>{addr.street}</p>
                <p>
                  {addr.area}, {addr.city} - {addr.postalCode}
                </p>
                <p className="font-mono text-[11px] text-zinc-500 pt-1">
                  Tel: {addr.phone}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(addr)}
                  aria-label={`Edit ${addr.label}`}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  aria-label={`Delete ${addr.label}`}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      <AddressModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        addressToEdit={editingAddress}
        onSave={handleSave}
      />
    </section>
  );
};
