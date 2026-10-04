"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/navbar/brand-logo";
import { Phone, Mail, MapPin } from "lucide-react";
import { useCMS } from "@/context/cms-context";
import { DEFAULT_FOOTER_CONFIG } from "@/data/cms-defaults";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { footerConfig } = useCMS();
  const config = footerConfig || DEFAULT_FOOTER_CONFIG;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-3.5 sm:pb-4 space-y-4 sm:space-y-5">
        {/* Main Footer Row: Brand & Contact on Left, Navigation on Right */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-12 pb-4">
          {/* Left Column: Brand Identity & Direct Concierge */}
          <div className="flex flex-col items-start space-y-2.5 max-w-sm">
            <div className="flex flex-col items-start">
              <BrandLogo />
              {config.tagline && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                  {config.tagline}
                </p>
              )}
            </div>

            {/* Concierge Hotline & Email Links */}
            <div className="flex flex-col space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
              <a
                href={`tel:${config.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="font-medium font-mono tabular-nums">{config.phone}</span>
              </a>
              <a
                href={`mailto:${config.email}`}
                className="inline-flex items-center gap-2 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="font-medium">{config.email}</span>
              </a>
              {config.address && (
                <div className="inline-flex items-start gap-2 text-zinc-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{config.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Navigation Links (Shop By) */}
          <div className="space-y-1.5 shrink-0 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-950 dark:text-zinc-200">
              Shop By
            </h4>
            <ul className="space-y-1 text-[11px] sm:text-xs">
              <li>
                <Link
                  href="/shop"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  Personal Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Compact & Sized Perfectly */}
        <div className="pt-3 border-t border-zinc-200/70 dark:border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500">
          <p className="order-2 sm:order-1 text-[10px] tracking-wider uppercase">
            {config.copyright || `© ${new Date().getFullYear()} INSPIRE LIFESTYLE. All rights reserved.`}
          </p>

          {/* Curated Social Media Icons */}
          <div className="order-1 sm:order-2 flex items-center gap-1.5">
            <a
              href="#"
              aria-label="Instagram"
              className="w-6 h-6 rounded-full bg-zinc-200/50 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 flex items-center justify-center hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="X Twitter"
              className="w-6 h-6 rounded-full bg-zinc-200/50 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 flex items-center justify-center hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
