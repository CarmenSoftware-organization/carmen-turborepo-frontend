"use client"

import * as React from "react"
import * as ReactDOM from "react-dom"
import { cn } from "@/lib/utils"

// Custom tooltip implementation with plain React components to ensure React 19 compatibility
// This replaces the Radix UI implementation with native HTML elements that behave similarly

interface TooltipProviderProps {
  readonly delayDuration?: number
  readonly skipDelayDuration?: number
  readonly disableHoverableContent?: boolean
  readonly children: React.ReactNode
}

// Context to store the tooltip provider configuration
const TooltipContext = React.createContext<{
  delayDuration: number
  skipDelayDuration: number
  disableHoverableContent: boolean
}>({
  delayDuration: 0,
  skipDelayDuration: 300,
  disableHoverableContent: false,
})

// TooltipProvider stores the configuration for all child tooltips
function TooltipProvider({
  delayDuration = 0,
  skipDelayDuration = 300,
  disableHoverableContent = false,
  children,
}: TooltipProviderProps) {
  const value = React.useMemo(
    () => ({
      delayDuration,
      skipDelayDuration,
      disableHoverableContent,
    }),
    [delayDuration, skipDelayDuration, disableHoverableContent]
  )

  return (
    <TooltipContext.Provider value={value}>
      {children}
    </TooltipContext.Provider>
  )
}

interface TooltipContentProps extends Readonly<React.HTMLAttributes<HTMLDivElement>> {
  readonly className?: string
  readonly sideOffset?: number
  readonly side?: "top" | "right" | "bottom" | "left"
  readonly align?: "start" | "center" | "end"
  readonly children?: React.ReactNode
}

// Context to store the tooltip state
const TooltipState = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerRef: React.RefObject<HTMLElement | null>
  contentProps: TooltipContentProps
  setContentProps: React.Dispatch<React.SetStateAction<TooltipContentProps>>
} | null>(null)

interface TooltipProps {
  readonly children: React.ReactNode
  readonly open?: boolean
  readonly defaultOpen?: boolean
  readonly onOpenChange?: (open: boolean) => void
}

// Tooltip component that manages the state of the tooltip
function Tooltip({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen

  const setOpen = React.useCallback(
    (nextOpen: React.SetStateAction<boolean>) => {
      const actualNextOpen = typeof nextOpen === "function" ? nextOpen(open) : nextOpen
      if (controlledOpen === undefined) {
        setUncontrolledOpen(actualNextOpen)
      }
      onOpenChange?.(actualNextOpen)
    },
    [controlledOpen, open, onOpenChange]
  )

  const [contentProps, setContentProps] = React.useState<TooltipContentProps>({})
  const triggerRef = React.useRef<HTMLElement | null>(null)

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentProps,
      setContentProps,
    }),
    [open, setOpen, contentProps]
  )

  return (
    <TooltipState.Provider value={value}>
      {children}
    </TooltipState.Provider>
  )
}

interface TooltipTriggerProps extends Readonly<React.HTMLAttributes<HTMLElement>> {
  readonly asChild?: boolean
  readonly children: React.ReactNode
}

// TooltipTrigger is the element that, when interacted with, shows the tooltip
function TooltipTrigger({
  asChild = false,
  children,
  ...props
}: TooltipTriggerProps) {
  const state = React.useContext(TooltipState)
  const context = React.useContext(TooltipContext)

  if (!state) {
    throw new Error("TooltipTrigger must be used within a Tooltip")
  }

  const { setOpen, triggerRef } = state

  const childProps = {
    ...props,
    ref: triggerRef,
    "data-slot": "tooltip-trigger",
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      props.onMouseEnter?.(e)

      const timer = setTimeout(() => {
        setOpen(true)
      }, context.delayDuration)

      return () => clearTimeout(timer)
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      props.onMouseLeave?.(e)
      setOpen(false)
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      props.onFocus?.(e)
      setOpen(true)
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      props.onBlur?.(e)
      setOpen(false)
    },
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, childProps)
  }

  return <span {...childProps}>{children}</span>
}

// TooltipContent displays the tooltip content
function TooltipContent({
  className,
  sideOffset = 0,
  side = "top",
  align = "center",
  children,
  ...props
}: TooltipContentProps) {
  const state = React.useContext(TooltipState)
  if (!state) {
    throw new Error("TooltipContent must be used within a Tooltip")
  }

  const { open, setContentProps } = state

  // Store content props for portal to use
  React.useEffect(() => {
    setContentProps({
      className,
      sideOffset,
      side,
      align,
      ...props,
    })
  }, [className, sideOffset, side, align, props, setContentProps])

  // This component doesn't render anything directly
  // The actual rendering happens in the TooltipPortal
  return <>{open && <TooltipPortal>{children}</TooltipPortal>}</>
}

// TooltipPortal renders the tooltip content positioned relative to the trigger
function TooltipPortal({ children }: Readonly<{ children: React.ReactNode }>) {
  const state = React.useContext(TooltipState)
  if (!state) {
    throw new Error("TooltipPortal must be used within a Tooltip")
  }

  const { triggerRef, contentProps } = state
  const { className, side = "top", align = "center", sideOffset = 0 } = contentProps

  const [position, setPosition] = React.useState({ top: 0, left: 0 })

  // Calculate position of tooltip based on trigger element position
  React.useEffect(() => {
    if (!triggerRef.current) return

    const updatePosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect()
      if (!triggerRect) return

      let top = 0
      let left = 0

      // Position based on side
      switch (side) {
        case "top":
          top = triggerRect.top - sideOffset
          break
        case "bottom":
          top = triggerRect.bottom + sideOffset
          break
        case "left":
          left = triggerRect.left - sideOffset
          top = triggerRect.top + triggerRect.height / 2
          break
        case "right":
          left = triggerRect.right + sideOffset
          top = triggerRect.top + triggerRect.height / 2
          break
      }

      // Adjust based on align
      if (side === "top" || side === "bottom") {
        switch (align) {
          case "start":
            left = triggerRect.left
            break
          case "center":
            left = triggerRect.left + triggerRect.width / 2
            break
          case "end":
            left = triggerRect.right
            break
        }
      } else if (side === "left" || side === "right") {
        switch (align) {
          case "start":
            top = triggerRect.top
            break
          case "center":
            top = triggerRect.top + triggerRect.height / 2
            break
          case "end":
            top = triggerRect.bottom
            break
        }
      }

      setPosition({ top, left })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [triggerRef, side, align, sideOffset])

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div
          data-slot="tooltip-content"
          className={cn(
            "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance fixed",
            side === "top" && "transform -translate-x-1/2 -translate-y-full",
            side === "bottom" && "transform -translate-x-1/2",
            side === "left" && "transform -translate-x-full -translate-y-1/2",
            side === "right" && "transform -translate-y-1/2",
            className
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          {...contentProps}
        >
          {children}
          <div
            className={cn(
              "bg-primary fill-primary z-50 size-2.5 absolute rotate-45 rounded-[2px]",
              side === "top" && "bottom-0.5 left-1/2 -translate-x-1/2 translate-y-1/2",
              side === "bottom" && "top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2",
              side === "left" && "right-0.5 top-1/2 translate-x-1/2 -translate-y-1/2",
              side === "right" && "left-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2"
            )}
          />
        </div>,
        document.body
      )}
    </React.Fragment>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
