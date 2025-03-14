"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLProgressElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLProgressElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    return (
      <div className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}>
        <progress
          ref={ref}
          value={value}
          max={100}
          data-slot="progress"
          data-state={value === 100 ? "complete" : "loading"}
          className="sr-only"
          {...props}
        />
        <div
          data-slot="progress-indicator"
          className="bg-primary h-full w-full flex-1 transition-all absolute top-0 left-0"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }
