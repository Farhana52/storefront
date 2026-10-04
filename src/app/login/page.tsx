import React from "react";
import { AuthContainer } from "@/components/auth/auth-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Inspire Lifestyle",
  description: "Sign in to your Inspire Lifestyle account to access private collections and orders.",
};

export default function LoginPage() {
  return <AuthContainer initialMode="login" />;
}
