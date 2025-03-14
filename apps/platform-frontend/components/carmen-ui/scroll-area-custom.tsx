"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
    children: React.ReactNode
    orientation?: "vertical" | "horizontal" | "both"
}

interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
    orientation?: "vertical" | "horizontal"
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
    ({ className, orientation = "vertical", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex touch-none select-none transition-colors",
                    orientation === "vertical"
                        ? "h-full w-2.5 border-l border-l-transparent p-[1px]"
                        : "h-2.5 border-t border-t-transparent p-[1px] flex-col",
                    className
                )}
                {...props}
            >
                <div
                    className={cn(
                        "relative flex-1 rounded-full bg-border",
                        "bg-muted/40 hover:bg-muted/60",
                        "dark:bg-muted/20 dark:hover:bg-muted/40"
                    )}
                />
            </div>
        )
    }
)
ScrollBar.displayName = "ScrollBar"

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({ className, orientation = "vertical", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("relative overflow-hidden", className)}
                {...props}
            >
                <div
                    className={cn(
                        "h-full w-full rounded-[inherit]",
                        "scrollbar-thin scrollbar-track-transparent",
                        "scrollbar-thumb-rounded-full",
                        "scrollbar-thumb-muted/40 hover:scrollbar-thumb-muted/60",
                        "dark:scrollbar-thumb-muted/20 dark:hover:scrollbar-thumb-muted/40",
                        "transition-colors duration-150 ease-in-out",
                        "[&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-button]:h-0",
                        "[&::-webkit-scrollbar-corner]:hidden",
                        orientation === "vertical" || orientation === "both"
                            ? "overflow-y-auto"
                            : "overflow-y-hidden",
                        orientation === "horizontal" || orientation === "both"
                            ? "overflow-x-auto"
                            : "overflow-x-hidden"
                    )}
                >
                    {children}
                </div>
            </div>
        )
    }
)

ScrollArea.displayName = "ScrollArea"

export { ScrollArea, ScrollBar }
