"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const StockLevelProgress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {

    const getStockColorClasses = (value: number) => {
        if (value >= 70) return "bg-green-600"
        if (value >= 50) return "bg-yellow-500"
        if (value >= 30) return "bg-orange-500"
        if (value >= 10) return "bg-red-500"
        return "bg-red-700"
    }

    const getBackgroundColorClasses = (value: number) => {
        if (value >= 70) return "bg-green-600/20"
        if (value >= 50) return "bg-yellow-500/20"
        if (value >= 30) return "bg-orange-500/20"
        if (value >= 10) return "bg-red-500/20"
        return "bg-red-700/20"
    }

    const stockColor = getStockColorClasses(value || 0)
    const bgColor = getBackgroundColorClasses(value || 0)

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full",
                bgColor,
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className={cn(
                    "h-full w-full flex-1 transition-all",
                    stockColor
                )}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    )
})

StockLevelProgress.displayName = ProgressPrimitive.Root.displayName

export { StockLevelProgress }