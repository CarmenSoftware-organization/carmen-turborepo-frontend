"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

// Context to manage popover state
interface PopoverContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorRef: React.RefObject<HTMLElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

const usePopover = () => {
  const context = React.useContext(PopoverContext)
  if (context === undefined) {
    throw new Error("usePopover must be used within a Popover")
  }
  return context
}

// Root component
interface PopoverProps {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover = ({ children, defaultOpen, open: controlledOpen, onOpenChange }: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen || false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const anchorRef = React.useRef<HTMLElement | null>(null)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    if (!isControlled) {
      setUncontrolledOpen(value)
    }

    if (onOpenChange) {
      const newValue = typeof value === "function" ? value(open) : value
      onOpenChange(newValue)
    }
  }, [isControlled, onOpenChange, open])

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    anchorRef,
    triggerRef,
  }), [open, setOpen])

  return (
    <PopoverContext.Provider value={contextValue}>
      <div data-slot="popover" data-state={open ? "open" : "closed"}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

// Trigger component
interface PopoverTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  asChild?: boolean;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ children, asChild, ...props }, forwardedRef) => {
    const { open, setOpen, triggerRef } = usePopover()
    const ref = React.useMemo(() => {
      if (forwardedRef) {
        return forwardedRef
      }
      return triggerRef
    }, [forwardedRef, triggerRef])

    const handleClick = () => {
      setOpen(!open)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ref,
        "data-slot": "popover-trigger",
        "data-state": open ? "open" : "closed",
        "aria-expanded": open,
        onClick: handleClick,
      } as React.HTMLAttributes<HTMLElement>)
    }

    return (
      <button
        type="button"
        ref={ref}
        data-slot="popover-trigger"
        data-state={open ? "open" : "closed"}
        aria-expanded={open}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
PopoverTrigger.displayName = "PopoverTrigger"

// Portal component for content
const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(children, document.body)
}

// Content component
interface PopoverContentProps extends React.HTMLAttributes<HTMLDialogElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
}

const PopoverContent = React.forwardRef<HTMLDialogElement, PopoverContentProps>(
  ({
    className,
    children,
    align = "center",
    sideOffset = 4,
    alignOffset = 0,
    avoidCollisions = true,
    ...props
  }, ref) => {
    const { open, setOpen, triggerRef } = usePopover()
    const contentRef = React.useRef<HTMLDialogElement>(null)
    const combinedRef = useCombinedRefs(ref, contentRef)

    React.useEffect(() => {
      const updatePosition = () => {
        if (!open || !triggerRef.current || !contentRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const contentRect = contentRef.current.getBoundingClientRect()

        let top = triggerRect.bottom + sideOffset
        let left: number

        // Handle alignment
        switch (align) {
          case "start":
            left = triggerRect.left + alignOffset
            break
          case "end":
            left = triggerRect.right - contentRect.width - alignOffset
            break
          case "center":
          default:
            left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2) + alignOffset
        }

        // Avoid window collisions if needed
        if (avoidCollisions) {
          if (left < 0) left = 4
          if (left + contentRect.width > window.innerWidth) {
            left = window.innerWidth - contentRect.width - 4
          }

          // Check if it would go below the viewport
          if (top + contentRect.height > window.innerHeight) {
            // Position above the trigger instead
            top = triggerRect.top - contentRect.height - sideOffset
          }
        }

        contentRef.current.style.position = "absolute"
        contentRef.current.style.top = `${top}px`
        contentRef.current.style.left = `${left}px`
      }

      updatePosition()

      window.addEventListener("resize", updatePosition)
      window.addEventListener("scroll", updatePosition)

      return () => {
        window.removeEventListener("resize", updatePosition)
        window.removeEventListener("scroll", updatePosition)
      }
    }, [open, triggerRef, align, sideOffset, alignOffset, avoidCollisions])

    // Handle click outside to close
    React.useEffect(() => {
      if (!open) return

      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [open, triggerRef, setOpen])

    if (!open) return null

    return (
      <Portal>
        <dialog
          ref={combinedRef}
          data-slot="popover-content"
          data-state={open ? "open" : "closed"}
          data-align={align}
          data-side="bottom"
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
            className
          )}
          open={open}
          aria-modal="true"
          {...props}
        >
          {children}
        </dialog>
      </Portal>
    )
  }
)
PopoverContent.displayName = "PopoverContent"

// Anchor component
interface PopoverAnchorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const PopoverAnchor = React.forwardRef<HTMLDivElement, PopoverAnchorProps>(
  ({ children, asChild, ...props }, forwardedRef) => {
    const { anchorRef } = usePopover()

    // Use a different approach to combine refs that works with different element types
    const handleRef = (element: HTMLDivElement | null) => {
      // Update our internal ref
      if (anchorRef.current !== element) {
        anchorRef.current = element;
      }

      // Forward the ref if needed
      if (typeof forwardedRef === 'function') {
        forwardedRef(element);
      } else if (forwardedRef) {
        // Use type assertion for object refs
        (forwardedRef as { current: HTMLDivElement | null }).current = element;
      }
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ref: handleRef,
        "data-slot": "popover-anchor",
      } as React.HTMLAttributes<HTMLElement>)
    }

    return (
      <div
        ref={handleRef}
        data-slot="popover-anchor"
        {...props}
      >
        {children}
      </div>
    )
  }
)
PopoverAnchor.displayName = "PopoverAnchor"

// Helper to combine refs
function useCombinedRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return React.useCallback((element: T) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(element);
      } else {
        (ref as { current: T | null }).current = element;
      }
    });
  }, [refs]);
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
