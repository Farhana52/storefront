import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "border-transparent bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900",
  secondary:
    "border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50",
  destructive:
    "border-transparent bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-900/50",
  outline: "text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800",
  success:
    "border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400",
  warning:
    "border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
