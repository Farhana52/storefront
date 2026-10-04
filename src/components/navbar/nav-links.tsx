"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/data/navigation";

export const NavLinks: React.FC<{ className?: string }> = ({ className = "" }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href === "/") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) {
          window.history.pushState(null, "", "/");
        }
      } else {
        e.preventDefault();
        router.push("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        }
      }
    }
  };

  return (
    <nav
      aria-label="Main Navigation"
      className={`hidden lg:flex items-center gap-1 xl:gap-2 ${className}`}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.label}
            href={item.href}
            scroll={true}
            onClick={(e) => handleLinkClick(item.href, e)}
            className={`group relative px-3 py-1.5 text-[13.5px] font-medium tracking-wide transition-colors duration-200 rounded-md cursor-pointer ${
              isActive
                ? "text-zinc-950 dark:text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              {item.label}
              {item.badge && (
                <span className="px-1.5 py-0.2 text-[9.5px] font-semibold tracking-wider uppercase rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs">
                  {item.badge}
                </span>
              )}
            </span>

            {/* Subtle animated underline on hover */}
            <span
              className={`absolute bottom-0 left-3 right-3 h-[1.5px] bg-zinc-950 dark:bg-white rounded-full transition-transform duration-200 origin-left ${
                isActive
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100 opacity-60 group-hover:opacity-100"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
};
