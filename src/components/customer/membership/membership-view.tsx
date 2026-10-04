"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Sparkles,
  Scissors,
  ShieldCheck,
  Truck,
  Copy,
  Check,
} from "lucide-react";
import { MEMBERSHIP_PRIVILEGES } from "../mock-data";
import { PromoVoucher } from "../types";

export const MembershipView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState<PromoVoucher[]>([]);

  useEffect(() => {
    async function loadVouchers() {
      try {
        const res = await fetch("/api/coupons");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.coupons) && data.coupons.length > 0) {
            setVouchers(
              data.coupons
                .filter((c: { active: boolean }) => c.active)
                .map((c: {
                  code: string;
                  discount: string;
                  minSpend?: string;
                  expiry?: string;
                  description?: string;
                }) => ({
                  code: c.code,
                  discount: c.discount,
                  minSpend: c.minSpend || "No minimum spend",
                  expiry: c.expiry || "Permanent VIP Privilege",
                  description: c.description || "Exclusive VIP patron discount.",
                }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load vouchers from DB:", err);
      }
    }
    loadVouchers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getPrivilegeIcon = (name: string) => {
    switch (name) {
      case "Scissors":
        return <Scissors className="w-4 h-4 text-amber-500" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      case "Truck":
        return <Truck className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <section aria-label="Membership & Rewards Workspace" className="space-y-8">
      {/* Tier Progress Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30 text-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Patron Loyalty Tier
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              Gold VIP Status
            </h2>
            <p className="text-xs text-zinc-400">
              Active since January 2026 · Lifetime atelier spend ৳48,500
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/90 border border-amber-500/20 text-center sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
              Available Store Credit
            </span>
            <p className="text-2xl font-bold font-mono tabular-nums text-amber-400">
              2,560 <span className="text-xs font-normal text-zinc-400">pts</span>
            </p>
            <p className="text-[11px] text-emerald-400 font-mono">
              Equivalent to ৳2,560
            </p>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-amber-400 font-semibold">Gold Tier (Current)</span>
            <span className="text-zinc-400">Platinum Atelier Tier (৳60,000)</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={48500}
            aria-valuemin={0}
            aria-valuemax={60000}
            aria-label="Progress to Platinum Atelier Tier"
            className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: "80.8%" }}
            />
          </div>
          <p className="text-[11px] text-zinc-400 font-mono text-right">
            Spend ৳11,500 more before Dec 31 to unlock Platinum Atelier privileges.
          </p>
        </div>
      </div>

      {/* VIP Privileges Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
            Tier Privileges
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MEMBERSHIP_PRIVILEGES.map((privilege, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-4 shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                {getPrivilegeIcon(privilege.iconName)}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {privilege.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {privilege.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active VIP Vouchers & Privileges */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
            Available Vouchers & Privilege Codes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vouchers.map((voucher) => (
            <div
              key={voucher.code}
              className="p-5 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col justify-between gap-4 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {voucher.discount}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {voucher.expiry}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                  {voucher.code}
                </h4>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {voucher.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-zinc-400 font-mono">
                  {voucher.minSpend}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(voucher.code)}
                  className="h-7 px-2.5 text-[10px] font-mono gap-1 cursor-pointer"
                >
                  {copiedCode === voucher.code ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
