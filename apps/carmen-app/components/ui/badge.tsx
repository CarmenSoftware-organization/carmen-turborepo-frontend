import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        active: "bg-emerald-200 text-emerald-800 hover:bg-emerald-300 transition-colors duration-200 rounded-full",
        inactive: "bg-rose-200 text-rose-800 hover:bg-rose-300 transition-colors duration-200 rounded-full",
        warning: "bg-amber-200 text-amber-800 hover:bg-amber-300 transition-colors duration-200 rounded-full",
        draft: "bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200 rounded-full",
        work_in_process: "bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors duration-200 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  Omit<VariantProps<typeof badgeVariants>, 'variant'> {
  variant?: VariantProps<typeof badgeVariants>['variant'] | string;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  const validVariants = ['default', 'secondary', 'destructive', 'outline', 'active', 'inactive', 'warning', 'draft', 'work_in_process'] as const;
  type ValidVariant = typeof validVariants[number];
  const safeVariant = validVariants.includes(variant as ValidVariant) ? variant as ValidVariant : 'default';

  return (
    <div className={cn(badgeVariants({ variant: safeVariant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
