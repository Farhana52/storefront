"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/data/navigation";
import { CloseIcon, ArrowRightIcon } from "@/components/ui/icons";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const { totalWishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    onClose();
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
    }
  };
  // Prevent background scrolling while menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Click outside overlay without any blur or dark overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Compact Menu Panel */}
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed top-18 right-3.5 sm:right-6 z-50 w-[270px] max-w-[calc(100vw-28px)] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 origin-top-right lg:hidden ${
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto visible"
            : "scale-95 opacity-0 pointer-events-none invisible"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex flex-col">
            <span className="text-xs font-extrabold tracking-[0.2em] text-zinc-950 dark:text-white uppercase leading-none">
              INSPIRE
            </span>
            <span className="text-[8px] font-semibold tracking-[0.24em] text-zinc-400 dark:text-zinc-500 uppercase mt-0.5 leading-none">
              LIFESTYLE
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-1.5 -mr-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Drawer Body - Navigation Links */}
        <div className="p-3.5">
          <nav className="flex flex-col space-y-0.5">
            {/* Wishlist Mobile Link */}
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white transition-colors group"
            >
              <span>Personal Wishlist</span>
              <div className="flex items-center gap-1.5">
                {totalWishlistItems > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-rose-500 text-white">
                    {totalWishlistItems}
                  </span>
                )}
                <span className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-transform group-hover:translate-x-0.5">
                  <ArrowRightIcon size={12} />
                </span>
              </div>
            </Link>

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                scroll={true}
                onClick={(e) => handleLinkClick(item.href, e)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white transition-colors group cursor-pointer"
              >
                <span>{item.label}</span>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                      {item.badge}
                    </span>
                  )}
                  <span className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-transform group-hover:translate-x-0.5">
                    <ArrowRightIcon size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-3.5 pt-0">
          <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80">
            {isAuthenticated && user ? (
              <div className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between shadow-2xs gap-2">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-2 min-w-0 flex-1 group"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-[10px] uppercase shrink-0 ring-1 ring-zinc-300 dark:ring-zinc-700">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-zinc-950 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {user.name}
                      </p>
                      <span className="px-1 py-0.2 text-[8px] font-mono font-semibold rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase">
                        Portal
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-500 truncate">
                      {user.identifier}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 px-1.5 py-0.5 rounded transition-colors shrink-0 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="w-full h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center text-center hover:opacity-90 active:scale-[0.99] transition-all shadow-xs cursor-pointer"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
