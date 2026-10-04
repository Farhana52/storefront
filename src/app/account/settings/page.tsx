import React from "react";
import { Metadata } from "next";
import { SettingsView } from "@/components/customer/settings/settings-view";

export const metadata: Metadata = {
  title: "Patron Settings | Patron Portal",
  description: "Configure your silhouette sizes, communications, and profile preferences.",
};

export default function AccountSettingsPage() {
  return <SettingsView />;
}
