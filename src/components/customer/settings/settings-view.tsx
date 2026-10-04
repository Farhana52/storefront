"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LogOut, Save, Check, Loader2 } from "lucide-react";

export const SettingsView: React.FC = () => {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || "Farhana Nasrin");
  const [email, setEmail] = useState(
    user?.email || (user?.identifier.includes("@") ? user.identifier : "farhana@inspire.com")
  );
  const [phone, setPhone] = useState(
    user?.phone || (!user?.identifier.includes("@") && user?.identifier ? user.identifier : "+880 1711-234567")
  );

  const [preferredSize, setPreferredSize] = useState("M");
  const [notifySms, setNotifySms] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyNewsletter, setNotifyNewsletter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const emailParam = user?.email || (user?.identifier?.includes("@") ? user.identifier : "farhana@inspire.com");
      const phoneParam = user?.phone || (user?.identifier && !user.identifier.includes("@") ? user.identifier : "+880 1711-234567");
      const res = await fetch(`/api/customer/profile?email=${encodeURIComponent(emailParam)}&phone=${encodeURIComponent(phoneParam)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.name) setName(data.name);
        if (data.email) setEmail(data.email);
        if (data.phone) setPhone(data.phone);
        if (data.preferredSize) setPreferredSize(data.preferredSize);
        if (typeof data.notifySms === "boolean") setNotifySms(data.notifySms);
        if (typeof data.notifyWhatsapp === "boolean") setNotifyWhatsapp(data.notifyWhatsapp);
        if (typeof data.notifyNewsletter === "boolean") setNotifyNewsletter(data.notifyNewsletter);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          name,
          preferredSize,
          notifySms,
          notifyWhatsapp,
          notifyNewsletter,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-label="Patron Settings & Preferences" className="space-y-8 max-w-3xl">
      {loading ? (
        <div className="flex items-center justify-center p-12 text-zinc-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-mono">Loading patron preferences...</span>
        </div>
      ) : (
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
              aria-label="Select default atelier garment size"
              className="flex flex-wrap gap-2.5 pt-1"
            >
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={preferredSize === s}
                  onClick={() => setPreferredSize(s)}
                  className={`px-4 py-2 min-h-[40px] rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                    preferredSize === s
                      ? "bg-amber-500 text-zinc-950 font-bold shadow-xs scale-[1.02]"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Communication Channels */}
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5 shadow-xs">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                Notifications
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-sms" className="text-xs font-semibold cursor-pointer">
                    SMS Order Updates
                  </Label>
                  <p className="text-[11px] text-zinc-500">
                    Real-time courier dispatch and delivery PIN alerts.
                  </p>
                </div>
                <Switch
                  id="notify-sms"
                  checked={notifySms}
                  onCheckedChange={setNotifySms}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-whatsapp" className="text-xs font-semibold cursor-pointer">
                    WhatsApp Concierge
                  </Label>
                  <p className="text-[11px] text-zinc-500">
                    Direct styling consultations and pre-delivery notifications.
                  </p>
                </div>
                <Switch
                  id="notify-whatsapp"
                  checked={notifyWhatsapp}
                  onCheckedChange={setNotifyWhatsapp}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-newsletter" className="text-xs font-semibold cursor-pointer">
                    Seasonal Editorial Newsletter
                  </Label>
                  <p className="text-[11px] text-zinc-500">
                    Curated seasonal drops and exclusive invitation-only events.
                  </p>
                </div>
                <Switch
                  id="notify-newsletter"
                  checked={notifyNewsletter}
                  onCheckedChange={setNotifyNewsletter}
                />
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto gap-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer min-h-[42px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved to Atelier Profile</span>
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
              onClick={logout}
              className="w-full sm:w-auto gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 cursor-pointer min-h-[42px]"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
