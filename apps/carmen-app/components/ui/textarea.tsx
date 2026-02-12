import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "bg-background flex min-h-[48px] w-full rounded-md border border-border px-2.5 py-1.5 text-xs shadow-sm placeholder:text-muted-foreground/40 dark:placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
      onFocus={e => e.target.select()}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
