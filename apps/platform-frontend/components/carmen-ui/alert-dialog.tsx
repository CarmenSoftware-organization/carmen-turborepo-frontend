"use client"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/carmen-ui/button"
import {
  ButtonHTMLAttributes,
  createContext,
  forwardRef,
  type ReactNode,
  type MouseEvent,
  type HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"

// AlertDialog Context
interface AlertDialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AlertDialogContext = createContext<AlertDialogContextValue>({
  open: false,
  onOpenChange: () => null,
})

// Root component
interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

const AlertDialog = ({ children, open: controlledOpen, onOpenChange }: AlertDialogProps) => {
  // Internal state for uncontrolled usage
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  // Handle open state changes
  const handleOpenChange = useCallback((value: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(value)
    }
    onOpenChange?.(value)
  }, [isControlled, onOpenChange])

  // Handle escape key for the entire dialog
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") {
        handleOpenChange(false)
      }
    }

    // Add global event listener
    document.addEventListener("keydown", handleEscapeKey)

    // Clean up
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [open, handleOpenChange])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ open, onOpenChange: handleOpenChange }),
    [open, handleOpenChange]
  )

  return (
    <AlertDialogContext.Provider value={contextValue}>
      {children}
    </AlertDialogContext.Provider>
  )
}

// Trigger component
type AlertDialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>

const AlertDialogTrigger = forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { onOpenChange } = useContext(AlertDialogContext)

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (props.onClick) props.onClick(e)
      onOpenChange(true)
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="alert-dialog-trigger"
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </button>
    )
  }
)
AlertDialogTrigger.displayName = "AlertDialogTrigger"

// Portal component
interface AlertDialogPortalProps {
  children?: ReactNode
  className?: string
}

const AlertDialogPortal = ({ children, className }: AlertDialogPortalProps) => {
  const { open } = useContext(AlertDialogContext)

  if (!open) return null

  return (
    <div
      data-slot="alert-dialog-portal"
      data-state={open ? "open" : "closed"}
      className={className}
    >
      {children}
    </div>
  )
}

// Backdrop component (renamed from Overlay for semantic clarity)
type AlertDialogBackdropProps = HTMLAttributes<HTMLDivElement>

const AlertDialogBackdrop = forwardRef<HTMLDivElement, AlertDialogBackdropProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-dialog-backdrop"
        aria-hidden="true"
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
          className
        )}
        {...props}
      />
    )
  }
)
AlertDialogBackdrop.displayName = "AlertDialogBackdrop"

// Content component
type AlertDialogContentProps = HTMLAttributes<HTMLDivElement>

const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useContext(AlertDialogContext)
    const contentRef = useRef<HTMLDivElement>(null)

    // Focus the first focusable element when dialog opens
    useEffect(() => {
      if (open && contentRef.current) {
        const focusableElements = contentRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus()
        }
      }
    }, [open])

    // Close when backdrop is clicked (without attaching listener to backdrop)
    const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
      // If the click was directly on the parent element (backdrop), close the dialog
      if (e.target === e.currentTarget) {
        onOpenChange(false)
      }
    }

    return (
      <AlertDialogPortal>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
          aria-hidden="true"
          data-overlay="true"
        >
          <AlertDialogBackdrop />
          <div
            ref={useMemo(() => {
              // Merge the refs
              return (node: HTMLDivElement) => {
                if (ref) {
                  if (typeof ref === 'function') ref(node)
                  else ref.current = node
                }
                contentRef.current = node
              }
            }, [ref])}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            data-state={open ? "open" : "closed"}
            data-slot="alert-dialog-content"
            tabIndex={-1}
            className={cn(
              "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </AlertDialogPortal>
    )
  }
)
AlertDialogContent.displayName = "AlertDialogContent"

// Header component
type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement>

const AlertDialogHeader = forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-dialog-header"
        className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
        {...props}
      />
    )
  }
)
AlertDialogHeader.displayName = "AlertDialogHeader"

// Footer component
type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement>

const AlertDialogFooter = forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-dialog-footer"
        className={cn(
          "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
          className
        )}
        {...props}
      />
    )
  }
)
AlertDialogFooter.displayName = "AlertDialogFooter"

// Title component
type AlertDialogTitleProps = HTMLAttributes<HTMLHeadingElement>

const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) {
      return null
    }

    return (
      <h2
        ref={ref}
        data-slot="alert-dialog-title"
        id="alert-dialog-title"
        className={cn("text-lg font-semibold", className)}
        {...props}
      >
        {children}
      </h2>
    )
  }
)
AlertDialogTitle.displayName = "AlertDialogTitle"

// Description component
type AlertDialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>

const AlertDialogDescription = forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-slot="alert-dialog-description"
        id="alert-dialog-description"
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
      />
    )
  }
)
AlertDialogDescription.displayName = "AlertDialogDescription"

// Action button component
type AlertDialogActionProps = ButtonHTMLAttributes<HTMLButtonElement>

const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = useContext(AlertDialogContext)

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e)
      onOpenChange(false)
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(buttonVariants(), className)}
        {...props}
      />
    )
  }
)
AlertDialogAction.displayName = "AlertDialogAction"

// Cancel button component
type AlertDialogCancelProps = ButtonHTMLAttributes<HTMLButtonElement>

const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = useContext(AlertDialogContext)

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e)
      onOpenChange(false)
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(buttonVariants({ variant: "outline" }), className)}
        {...props}
      />
    )
  }
)
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
