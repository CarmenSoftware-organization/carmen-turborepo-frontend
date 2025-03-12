import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                green: "border-transparent bg-green-500 text-white hover:bg-green-600",
                red: "border-transparent bg-red-500 text-white hover:bg-red-600",
                yellow: "border-transparent bg-yellow-500 text-black hover:bg-yellow-600",
                violet: "border-transparent bg-violet-500 text-white hover:bg-violet-600",
                blue: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);


export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

const StatusBadge = ({ className, variant, ...props }: BadgeProps) => {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { StatusBadge, badgeVariants }
