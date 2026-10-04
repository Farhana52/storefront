import React from "react";
import { AuthContainer } from "@/components/auth/auth-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — Inspire Lifestyle",
  description: "Reset your Inspire Lifestyle account password securely.",
};

export default function ForgotPasswordPage() {
  return <AuthContainer initialMode="forgot" />;
}
