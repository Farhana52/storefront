"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PatronAddress } from "../types";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressToEdit: PatronAddress | null;
  onSave: (address: Omit<PatronAddress, "id">, editId?: string) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  open,
  onOpenChange,
  addressToEdit,
  onSave,
}) => {
  const [label, setLabel] = useState("Primary Residence");
  const [recipientName, setRecipientName] = useState("Farhana Nasrin");
  const [phone, setPhone] = useState("+880 1711-234567");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("Banani");
  const [city, setCity] = useState("Dhaka");
  const [postalCode, setPostalCode] = useState("1213");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (addressToEdit) {
      setLabel(addressToEdit.label);
      setRecipientName(addressToEdit.recipientName);
      setPhone(addressToEdit.phone);
      setStreet(addressToEdit.street);
      setArea(addressToEdit.area);
      setCity(addressToEdit.city);
      setPostalCode(addressToEdit.postalCode);
      setIsDefault(addressToEdit.isDefault);
    } else {
      setLabel("Residence / Studio");
      setRecipientName("Farhana Nasrin");
      setPhone("+880 1711-234567");
      setStreet("");
      setArea("Banani");
      setCity("Dhaka");
      setPostalCode("1213");
      setIsDefault(false);
    }
  }, [addressToEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) return;

    onSave(
      {
        label,
        recipientName,
        phone,
        street,
        area,
        city,
        postalCode,
        isDefault,
      },
      addressToEdit?.id
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <DialogTitle className="text-lg font-bold text-zinc-950 dark:text-white">
            {addressToEdit ? "Edit Delivery Location" : "Add New Delivery Location"}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Ensure exact street and area details for seamless concierge hand-off.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="addr-label" className="text-xs font-medium">
              Location Label
            </Label>
            <Input
              id="addr-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Primary Residence, Atelier Studio"
              className="text-xs h-9"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="addr-name" className="text-xs font-medium">
                Recipient Name
              </Label>
              <Input
                id="addr-name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-phone" className="text-xs font-medium">
                Contact Phone
              </Label>
              <Input
                id="addr-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs h-9 font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-street" className="text-xs font-medium">
              Street & House / Apartment No.
            </Label>
            <Input
              id="addr-street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="House #, Road #, Apartment / Suite"
              className="text-xs h-9"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="addr-area" className="text-xs font-medium">
                Area
              </Label>
              <Input
                id="addr-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Banani"
                className="text-xs h-9"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-city" className="text-xs font-medium">
                City
              </Label>
              <Input
                id="addr-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Dhaka"
                className="text-xs h-9"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-postal" className="text-xs font-medium">
                Postal Code
              </Label>
              <Input
                id="addr-postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="1213"
                className="text-xs h-9 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Set as Default Address
              </p>
              <p className="text-[11px] text-zinc-500">
                Used automatically during checkout and concierge appointments
              </p>
            </div>
            <Switch
              checked={isDefault}
              onCheckedChange={setIsDefault}
              aria-label="Set as default address"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              Save Address
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
