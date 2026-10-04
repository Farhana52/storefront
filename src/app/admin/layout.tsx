import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin CRM & Atelier Operations — INSPIRE LIFESTYLE",
  description:
    "Enterprise operations, order fulfillment, and patron CRM dashboard for Inspire Lifestyle.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
