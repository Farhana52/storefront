"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { CommandPalette } from "@/components/admin/command-palette";

interface AdminShellProps {
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Global Apple-style Cmd + K / Ctrl + K shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50/50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 antialiased">
      {/* Persistent shadcn Admin Sidebar */}
      <Suspense
        fallback={
          <aside className="hidden lg:block w-68 shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200/80 dark:border-zinc-800/80" />
        }
      >
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <AdminHeader
          onToggleMobile={() => setMobileSidebarOpen(true)}
          onRefresh={() => showNotification("CRM data refreshed.")}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold shadow-xl border border-white/10 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2">
            <span>{notification}</span>
          </div>
        )}

        <main className="flex-1 p-5 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          <Suspense
            fallback={
              <div className="p-8 text-xs text-zinc-400 font-mono">
                Loading console...
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>

      {/* Apple Spotlight-style Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};
