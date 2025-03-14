"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface HoverCardContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  onHoverStart: () => void
  onHoverEnd: () => void
}

const HoverCardContext = React.createContext<HoverCardContextValue | undefined>(undefined)

interface HoverCardProps {
  children: React.ReactNode
  openDelay?: number
  closeDelay?: number
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const HoverCard = ({
  children,
  openDelay = 700,
  closeDelay = 300,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange
}: HoverCardProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined

  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = React.useCallback((value: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(value)
    }
    onOpenChange?.(value)
  }, [isControlled, onOpenChange])

  const openTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const clearTimeouts = React.useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
  }, [])

  const onHoverStart = React.useCallback(() => {
    clearTimeouts()
    openTimeoutRef.current = setTimeout(() => {
      setOpen(true)
    }, openDelay)
  }, [clearTimeouts, openDelay, setOpen])

  const onHoverEnd = React.useCallback(() => {
    clearTimeouts()
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, closeDelay)
  }, [clearTimeouts, closeDelay, setOpen])

  React.useEffect(() => {
    return clearTimeouts
  }, [clearTimeouts])

  const memoizedValue = React.useMemo(
    () => ({ open, setOpen, onHoverStart, onHoverEnd }),
    [open, setOpen, onHoverStart, onHoverEnd]
  )

  return (
    <HoverCardContext.Provider value={memoizedValue}>
      <div data-slot="hover-card">
        {children}
      </div>
    </HoverCardContext.Provider>
  )
}

const useHoverCard = () => {
  const context = React.useContext(HoverCardContext)
  if (!context) {
    throw new Error("useHoverCard must be used within a HoverCard component")
  }
  return context
}

interface HoverCardTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const HoverCardTrigger = React.forwardRef<HTMLButtonElement, HoverCardTriggerProps>(
  ({ children, ...props }, ref) => {
    const { onHoverStart, onHoverEnd } = useHoverCard()

    return (
      <button
        type="button"
        ref={ref}
        data-slot="hover-card-trigger"
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onFocus={onHoverStart}
        onBlur={onHoverEnd}
        className={cn("inline-flex items-center justify-center bg-transparent p-0 text-inherit", props.className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
HoverCardTrigger.displayName = "HoverCardTrigger"

interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "center" | "start" | "end"
  sideOffset?: number
  className?: string
}

const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => {
    const { open, onHoverStart, onHoverEnd } = useHoverCard()

    if (!open) return null

    // Extract alignment style logic
    let alignmentStyle;
    if (align === "start") {
      alignmentStyle = { left: 0 };
    } else if (align === "end") {
      alignmentStyle = { right: 0 };
    } else {
      alignmentStyle = { left: "50%", transform: "translateX(-50%)" };
    }

    return (
      <div
        ref={ref}
        data-slot="hover-card-content"
        data-align={align}
        role="tooltip"
        aria-live="polite"
        style={{
          marginTop: sideOffset,
          ...alignmentStyle
        }}
        className={cn(
          "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 z-50 w-64 rounded-md border p-4 shadow-md absolute",
          className
        )}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        {...props}
      />
    )
  }
)
HoverCardContent.displayName = "HoverCardContent"

export { HoverCard, HoverCardTrigger, HoverCardContent }
