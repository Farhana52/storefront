import React from "react";
import { Metadata } from "next";
import { OrdersView } from "@/components/customer/orders/orders-view";

export const metadata: Metadata = {
  title: "Orders & Consignments | Patron Portal",
  description: "View and track your atelier orders and deliveries.",
};

export default function AccountOrdersPage() {
  return <OrdersView />;
}
