"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const ProgressCustom = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
    const getProgressColor = (value: number | undefined | null) => {
        if (!value) return "bg-red-500";
        if (value === 100) return "bg-green-500";
        if (value >= 75) return "bg-orange-500";
        if (value >= 50) return "bg-yellow-500";
        if (value > 0) return "bg-orange-500";
        return "bg-red-500";
    };

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className={`h-full w-full flex-1 transition-all ${getProgressColor(value)}`}
                style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
})
ProgressCustom.displayName = ProgressPrimitive.Root.displayName

export { ProgressCustom }
