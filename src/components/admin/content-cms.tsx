"use client";

import React, { useState } from "react";
import { useCMS } from "@/context/cms-context";
import {
  Megaphone,
  Phone,
  Mail,
  MapPin,
  RotateCcw,
  CheckCircle2,
  Save,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const ContentCMS: React.FC = () => {
  const {
    announcement,
    updateAnnouncement,
    footerConfig,
    updateFooter,
    resetToDefaults,
  } = useCMS();

  // Local state for announcement
  const [announcementState, setAnnouncementState] = useState(announcement);
  // Local state for footer
  const [footerState, setFooterState] = useState(footerConfig);

  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement(announcementState);
    updateFooter(footerState);
    setSavedMessage("Storefront content saved successfully");
    setTimeout(() => setSavedMessage(null), 3500);
  };

  const handleReset = () => {
    if (confirm("Reset content to system defaults?")) {
      resetToDefaults();
      setAnnouncementState(announcement);
      setFooterState(footerConfig);
      setSavedMessage("Content reset to defaults");
      setTimeout(() => setSavedMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Storefront content
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Announcement banner, customer contact channels, and footer branding
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Reset defaults</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSaveAll}
            className="gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save changes</span>
          </Button>
        </div>
      </div>

      {savedMessage && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Section 1: Top Announcement Bar */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Announcement banner
                </h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Top notification bar across customer storefront pages
                </p>
              </div>
            </div>

            {/* Toggle switch for Banner enabled */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {announcementState.enabled ? "Banner active" : "Banner hidden"}
              </span>
              <Switch
                checked={announcementState.enabled}
                onCheckedChange={(checked) =>
                  setAnnouncementState((prev) => ({ ...prev, enabled: checked }))
                }
                aria-label="Toggle storefront announcement banner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="announcement-text"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Banner message
              </label>
              <input
                id="announcement-text"
                type="text"
                value={announcementState.text}
                onChange={(e) =>
                  setAnnouncementState({ ...announcementState, text: e.target.value })
                }
                placeholder="Complimentary shipping across Bangladesh for orders over ৳5,000"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="announcement-link-text"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Button label
              </label>
              <input
                id="announcement-link-text"
                type="text"
                value={announcementState.linkText}
                onChange={(e) =>
                  setAnnouncementState({ ...announcementState, linkText: e.target.value })
                }
                placeholder="Shop now"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="announcement-link-href"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Destination URL
              </label>
              <input
                id="announcement-link-href"
                type="text"
                value={announcementState.linkHref || "/shop"}
                onChange={(e) =>
                  setAnnouncementState({ ...announcementState, linkHref: e.target.value })
                }
                placeholder="/shop"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Channels & Showroom */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Contact channels & location
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Direct phone, support email, and showroom location in the footer
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="footer-phone"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5"
              >
                <Phone className="w-3 h-3 text-zinc-400" />
                <span>Phone hotline</span>
              </label>
              <input
                id="footer-phone"
                type="text"
                value={footerState.phone}
                onChange={(e) =>
                  setFooterState({ ...footerState, phone: e.target.value })
                }
                placeholder="+880 1800-000000"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono"
              />
            </div>

            <div>
              <label
                htmlFor="footer-email"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5"
              >
                <Mail className="w-3 h-3 text-zinc-400" />
                <span>Support email</span>
              </label>
              <input
                id="footer-email"
                type="email"
                value={footerState.email}
                onChange={(e) =>
                  setFooterState({ ...footerState, email: e.target.value })
                }
                placeholder="support@inspirelifestyle.com"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="footer-address"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5"
            >
              <MapPin className="w-3 h-3 text-zinc-400" />
              <span>Showroom address</span>
            </label>
            <input
              id="footer-address"
              type="text"
              value={footerState.address}
              onChange={(e) =>
                setFooterState({ ...footerState, address: e.target.value })
              }
              placeholder="House 42, Road 11, Block D, Banani, Dhaka, Bangladesh"
              className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>

        {/* Section 3: Brand Identity & Legal */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Brand & copyright
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Storefront brand identity, tagline, and legal footer notice
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="footer-brand-name"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Brand name
              </label>
              <input
                id="footer-brand-name"
                type="text"
                value={footerState.brandName}
                onChange={(e) =>
                  setFooterState({ ...footerState, brandName: e.target.value })
                }
                placeholder="Inspire Lifestyle"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="footer-tagline"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Tagline
              </label>
              <input
                id="footer-tagline"
                type="text"
                value={footerState.tagline}
                onChange={(e) =>
                  setFooterState({ ...footerState, tagline: e.target.value })
                }
                placeholder="Atelier of Modern Luxury & Artisanal Fashion"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="footer-copyright"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Copyright notice
            </label>
            <input
              id="footer-copyright"
              type="text"
              value={footerState.copyright}
              onChange={(e) =>
                setFooterState({ ...footerState, copyright: e.target.value })
              }
              placeholder="© 2026 INSPIRE LIFESTYLE. All rights reserved."
              className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save changes</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
