"use client";

import React, { useState } from "react";
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
import { DEFAULT_PROMO_VOUCHERS, MEMBERSHIP_PRIVILEGES } from "../mock-data";

export const MembershipView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEMBERSHIP_PRIVILEGES.map((privilege, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5 shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                {getPrivilegeIcon(privilege.iconName)}
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                {privilege.title}
              </h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                {privilege.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Promo Vouchers Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
            Active Vouchers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEFAULT_PROMO_VOUCHERS.map((voucher) => {
            const isCopied = copiedCode === voucher.code;

            return (
              <div
                key={voucher.code}
                className="p-5 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 flex flex-col justify-between space-y-4 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                      {voucher.discount}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-400">
                      {voucher.expiry}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-200">
                    {voucher.description}
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    {voucher.minSpend}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-zinc-200/60 dark:border-zinc-800">
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white tracking-wider">
                    {voucher.code}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(voucher.code)}
                    className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                    aria-label={`Copy coupon code ${voucher.code}`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-zinc-500" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
