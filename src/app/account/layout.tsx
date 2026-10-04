import React from "react";
import { Metadata } from "next";
import { PatronHero } from "@/components/customer/patron-hero";
import { PortalNav } from "@/components/customer/portal-nav";

export const metadata: Metadata = {
  title: "Patron Portal | Inspire Lifestyle Atelier",
  description:
    "Manage your bespoke orders, track consignments, curate saved pieces, and view VIP patron privileges.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-stone-50/50 dark:bg-zinc-950 min-h-screen pb-16 pt-6 sm:pt-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <PatronHero />
        <PortalNav />
        <main className="focus-visible:outline-none">{children}</main>
      </div>
    </div>
  );
}
