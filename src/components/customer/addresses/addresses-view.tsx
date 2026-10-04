"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Edit3, Trash2, CheckCircle2 } from "lucide-react";
import { DEFAULT_PATRON_ADDRESSES } from "../mock-data";
import { PatronAddress } from "../types";
import { AddressModal } from "./address-modal";

export const AddressesView: React.FC = () => {
  const [addresses, setAddresses] = useState<PatronAddress[]>(DEFAULT_PATRON_ADDRESSES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<PatronAddress | null>(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: PatronAddress) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleSave = (addressData: Omit<PatronAddress, "id">, editId?: string) => {
    if (editId) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editId) {
            return { ...addressData, id: editId };
          }
          if (addressData.isDefault) {
            return { ...a, isDefault: false };
          }
          return a;
        })
      );
    } else {
      const newAddress: PatronAddress = {
        ...addressData,
        id: `addr_${Date.now()}`,
      };
      setAddresses((prev) => {
        if (newAddress.isDefault) {
          return [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))];
        }
        return [...prev, newAddress];
      });
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
                    className="text-sm font-bold text-zinc-900 dark:text-zinc-50"
                  >
                    {addr.label}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{addr.recipientName}</p>
                </div>
              </div>

              {addr.isDefault && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Default
                </span>
              )}
            </div>

            <div className="mt-4 text-xs font-mono text-zinc-700 dark:text-zinc-300 space-y-1">
              <p>{addr.street}</p>
              <p>
                {addr.area}, {addr.city} {addr.postalCode && `· ${addr.postalCode}`}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 pt-1">Phone: {addr.phone}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                  >
                    Set as default
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(addr)}
                  className="h-8 px-2.5 text-xs gap-1 text-zinc-600 dark:text-zinc-300"
                  aria-label={`Edit ${addr.label}`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Button>

                {addresses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(addr.id)}
                    className="h-8 px-2.5 text-xs gap-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    aria-label={`Delete ${addr.label}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </Button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <AddressModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        addressToEdit={editingAddress}
        onSave={handleSave}
      />
    </section>
  );
};
