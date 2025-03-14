"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface CollapsibleContextValue {
  open: boolean
  toggle: () => void
  contentId: string
  triggerId: string
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | undefined>(undefined)

interface CollapsibleProps {
  children?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ children, defaultOpen = false, open: controlledOpen, onOpenChange, disabled = false, className, ...props }, ref) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const [contentId] = React.useState(() => `collapsible-content-${Math.random().toString(36).slice(2, 11)}`)
    const [triggerId] = React.useState(() => `collapsible-trigger-${Math.random().toString(36).slice(2, 11)}`)

    const open = controlledOpen ?? uncontrolledOpen

    const toggle = React.useCallback(() => {
      if (disabled) return

      if (controlledOpen === undefined) {
        setUncontrolledOpen((prev) => !prev)
      }

      onOpenChange?.(!open)
    }, [controlledOpen, disabled, onOpenChange, open])

    const contextValue = React.useMemo(
      () => ({ open, toggle, contentId, triggerId }),
      [open, toggle, contentId, triggerId]
    )

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="collapsible"
          data-state={open ? "open" : "closed"}
          className={className}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

const useCollapsibleContext = () => {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("useCollapsibleContext must be used within a Collapsible")
  }
  return context
}

interface CollapsibleTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  children?: React.ReactNode
  asChild?: boolean
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { open, toggle, contentId, triggerId } = useCollapsibleContext()

    return (
      <button
        type="button"
        ref={ref}
        id={triggerId}
        data-slot="collapsible-trigger"
        data-state={open ? "open" : "closed"}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={toggle}
        className={className}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  forceMount?: boolean
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ children, className, forceMount, ...props }, ref) => {
    const { open, contentId, triggerId } = useCollapsibleContext()

    if (!forceMount && !open) {
      return null
    }

    return (
      <div
        ref={ref}
        id={contentId}
        data-slot="collapsible-content"
        data-state={open ? "open" : "closed"}
        aria-labelledby={triggerId}
        hidden={!open}
        className={cn(
          "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
