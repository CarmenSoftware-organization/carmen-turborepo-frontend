import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "text-[11px] inline-flex items-center rounded-full px-1.5 md:px-2.5 py-0 md:py-0.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        active: "bg-emerald-100 text-emerald-800 borde-none",
        inactive: "bg-rose-100 text-rose-800 borde-none",
        voided: "bg-rose-100 text-rose-800 borde-none",
        warning: "bg-amber-100 text-amber-800 borde-none",
        draft: "bg-gray-100 text-gray-800 borde-none",
        work_in_process: "bg-blue-100 text-blue-800 borde-none",
        in_progress: "bg-yellow-100 text-yellow-800 borde-none",
        product_badge:
          "bg-slate-100 dark:bg-gray-600 dark:text-gray-300 text-slate-800   borde-none",
        completed: "bg-emerald-400 text-emerald-900 borde-none",
        submit: "bg-slate-100 dark:bg-gray-600 dark:text-gray-300 text-slate-800   borde-none",
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
