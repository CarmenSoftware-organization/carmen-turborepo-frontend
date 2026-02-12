import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "text-[11px] inline-flex items-center rounded-md px-2 py-0.5 font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80",
        outline: "text-foreground border-border",
        active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        inactive: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
        voided: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
        warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        draft: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700",
        work_in_process: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
        in_progress: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
        product_badge:
          "bg-slate-50 text-slate-700 border-slate-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600",
        completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        submit: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof badgeVariants>, "variant"> {
  readonly variant?: VariantProps<typeof badgeVariants>["variant"] | string;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  const validVariants = [
    "submit",
    "default",
    "secondary",
    "destructive",
    "outline",
    "active",
    "inactive",
    "warning",
    "draft",
    "work_in_process",
    "in_progress",
    "voided",
    "product_badge",
    "completed",
  ] as const;

  type ValidVariant = (typeof validVariants)[number];
  const safeVariant = validVariants.includes(variant as ValidVariant)
    ? (variant as ValidVariant)
    : "default";

  return <div className={cn(badgeVariants({ variant: safeVariant }), className)} {...props} />;
}

export { Badge, badgeVariants };
