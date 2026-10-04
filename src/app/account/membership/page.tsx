import React from "react";
import { Metadata } from "next";
import { MembershipView } from "@/components/customer/membership/membership-view";

export const metadata: Metadata = {
  title: "Membership & Rewards | Patron Portal",
  description: "View your VIP patron tier, loyalty points, privileges, and active vouchers.",
};

export default function AccountMembershipPage() {
  return <MembershipView />;
}
