"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { Crown, Sparkles, CheckCircle2 } from "lucide-react";

export const PatronHero: React.FC = () => {
  const { user } = useAuth();

  const displayName = user?.name || "Farhana Nasrin";
  const displayEmail =
    user?.email ||
    (user?.identifier.includes("@") ? user.identifier : "farhana@inspirelifestyle.com");
  const displayPhone =
    user?.phone ||
    (!user?.identifier.includes("@") && user?.identifier ? user.identifier : "+880 1711-234567");

  return (
    <section
      aria-label="Patron Profile Overview"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-stone-950 text-white p-4 sm:p-6 lg:p-8 border border-zinc-800/80 shadow-xl"
    >
      {/* Subtle luxury background radial glare */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 bg-stone-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        {/* Patron Identity Details */}
        <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-stone-100 text-stone-900 dark:bg-stone-200 flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl shadow-md border-2 border-amber-500/30">
              {displayName.charAt(0)}
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-zinc-950"
              title="Verified Patron Account"
              aria-label="Verified Patron Account"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="min-w-0 space-y-0.5 sm:space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white truncate">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Crown className="w-3 h-3 text-amber-400" />
                VIP Patron
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 truncate font-mono">
              {displayEmail}
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span>{displayPhone}</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-600" aria-hidden="true" />
              <span className="hidden sm:inline text-emerald-400">Dhaka Atelier</span>
            </div>
          </div>
        </div>

        {/* Patron KPI Stat Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto shrink-0">
          <div className="p-2 sm:p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center min-w-0 shadow-sm">
            <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
              <span className="sm:hidden">Orders</span>
              <span className="hidden sm:inline">Active Orders</span>
            </p>
            <p className="text-sm sm:text-lg font-bold font-mono tabular-nums text-white mt-0.5">
              1 <span className="text-[11px] font-normal text-zinc-400 hidden xs:inline">in transit</span>
            </p>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center min-w-0 shadow-sm">
            <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
              Points
            </p>
            <p className="text-sm sm:text-lg font-bold font-mono tabular-nums text-amber-400 mt-0.5">
              2,560
            </p>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center min-w-0 shadow-sm">
            <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
              Concierge
            </p>
            <p className="text-sm sm:text-lg font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              Verified
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
