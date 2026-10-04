import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-stone-50/50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
            Error 404 &middot; Page Not Located
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Archival Piece Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The page or curated edition you are looking for might have been retired, relocated, or does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity shadow-sm"
          >
            <span>Return Home</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold tracking-wider uppercase hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <span>Explore Catalog</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
