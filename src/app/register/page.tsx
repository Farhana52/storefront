import React from "react";
import { AuthContainer } from "@/components/auth/auth-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account — Inspire Lifestyle",
  description: "Join the Inspire Lifestyle circle to receive private invitations, presales, and complimentary delivery.",
};

export default function RegisterPage() {
  return <AuthContainer initialMode="register" />;
}
