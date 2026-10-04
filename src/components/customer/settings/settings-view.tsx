"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LogOut, Save, Check } from "lucide-react";

export const SettingsView: React.FC = () => {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || "Farhana Nasrin");
  const [email, setEmail] = useState(
    user?.email || (user?.identifier.includes("@") ? user.identifier : "farhana@inspirelifestyle.com")
  );
  const [phone, setPhone] = useState(
    user?.phone || (!user?.identifier.includes("@") && user?.identifier ? user.identifier : "+880 1711-234567")
  );

  const [preferredSize, setPreferredSize] = useState("M");
  const [notifySms, setNotifySms] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyNewsletter, setNotifyNewsletter] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <section aria-label="Patron Settings & Preferences" className="space-y-8 max-w-3xl">
      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details Section */}
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-xs">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              Profile Details
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="patron-name" className="text-xs font-medium">
                Full Name
              </Label>
              <Input
                id="patron-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="patron-email" className="text-xs font-medium">
                  Email Address
                </Label>
                <Input
                  id="patron-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs h-9 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="patron-phone" className="text-xs font-medium">
                  Phone Number
                </Label>
                <Input
                  id="patron-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-xs h-9 font-mono"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Silhouette Preferences */}
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white">
              Size Preference
            </h3>
          </div>

          <div
            role="radiogroup"
            aria-label="Select default garment size"
            className="flex flex-wrap gap-2 pt-1"
          >
            {sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                role="radio"
                aria-checked={preferredSize === sz}
                onClick={() => setPreferredSize(sz)}
                className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  preferredSize === sz
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 ring-2 ring-amber-500/50 shadow-sm"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Communication & Concierge Notifications */}
        <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white">
              Notifications
            </h3>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  SMS Order Updates
                </p>
                <p className="text-[11px] text-zinc-500">
                  Consignment dispatch alerts
                </p>
              </div>
              <Switch
                checked={notifySms}
                onCheckedChange={setNotifySms}
                aria-label="SMS order dispatch notifications"
              />
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  WhatsApp Concierge
                </p>
                <p className="text-[11px] text-zinc-500">
                  Fitting and order alerts
                </p>
              </div>
              <Switch
                checked={notifyWhatsapp}
                onCheckedChange={setNotifyWhatsapp}
                aria-label="WhatsApp concierge messaging"
              />
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Lookbook Newsletter
                </p>
                <p className="text-[11px] text-zinc-500">
                  Seasonal collection drops
                </p>
              </div>
              <Switch
                checked={notifyNewsletter}
                onCheckedChange={setNotifyNewsletter}
                aria-label="Atelier seasonal newsletter"
              />
            </div>
          </div>
        </div>

        {/* Save and Sign-out Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            type="submit"
            size="sm"
            className="gap-2 cursor-pointer bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 min-h-[40px] px-4"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save changes</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={logout}
            className="gap-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer min-h-[40px] px-3.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </Button>
        </div>
      </form>
    </section>
  );
};
