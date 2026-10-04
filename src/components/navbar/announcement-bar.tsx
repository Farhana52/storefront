import React from "react";
import { ANNOUNCEMENTS } from "@/data/navigation";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="w-full bg-zinc-950 text-white dark:bg-zinc-900 dark:text-zinc-200 text-[11px] tracking-[0.14em] uppercase font-medium py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:block text-[10px] text-zinc-400 tracking-widest">
          DHAKA &bull; CHITTAGONG &bull; SYLHET
        </div>
        <div className="flex-1 text-center truncate">
          <span>{ANNOUNCEMENTS[0]}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-zinc-400">
          <span className="hover:text-white transition-colors cursor-pointer">Client Care</span>
          <span>&bull;</span>
          <span className="hover:text-white transition-colors cursor-pointer">Currency: BDT (৳)</span>
        </div>
      </div>
    </div>
  );
};
