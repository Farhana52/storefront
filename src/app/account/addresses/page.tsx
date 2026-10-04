import React from "react";
import { Metadata } from "next";
import { AddressesView } from "@/components/customer/addresses/addresses-view";

export const metadata: Metadata = {
  title: "Delivery Addresses | Patron Portal",
  description: "Manage your delivery addresses and concierge appointments.",
};

export default function AccountAddressesPage() {
  return <AddressesView />;
}
