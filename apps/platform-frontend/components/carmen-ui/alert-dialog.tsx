"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// AlertDialog Context
interface AlertDialogContextValue {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const AlertDialogContext = React.createContext<AlertDialogContextValue>({})

// Root component
interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const AlertDialog = ({ children, open, onOpenChange }: AlertDialogProps) => {
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({ open, onOpenChange }),
    [open, onOpenChange]
  )

  return (
    <AlertDialogContext.Provider value={contextValue}>
      <div data-slot="alert-dialog">{children}</div>
    </AlertDialogContext.Provider>
  )
}

// Trigger component
type AlertDialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)
    return (
      <button
        ref={ref}
        type="button"
        data-slot="alert-dialog-trigger"
        onClick={() => onOpenChange?.(true)}
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
  children?: React.ReactNode
}

const AlertDialogPortal = ({ children }: AlertDialogPortalProps) => {
  const { open } = React.useContext(AlertDialogContext)
  if (!open) return null

  return (
    <div data-slot="alert-dialog-portal">
      {children}
    </div>
  )
}

// Overlay component
type AlertDialogOverlayProps = React.HTMLAttributes<HTMLDivElement>

const AlertDialogOverlay = React.forwardRef<HTMLDivElement, AlertDialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange?.(false)
      }
    }

    return (
      <div
        ref={ref}
        data-slot="alert-dialog-overlay"
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
          className
        )}
        onClick={() => onOpenChange?.(false)}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        aria-hidden="true"
        {...props}
      />
    )
  }
)
AlertDialogOverlay.displayName = "AlertDialogOverlay"

// Content component
type AlertDialogContentProps = React.HTMLAttributes<HTMLDivElement>

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <div
          ref={ref}
          role="alertdialog"
          aria-modal="true"
          data-slot="alert-dialog-content"
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AlertDialogPortal>
    )
  }
)
AlertDialogContent.displayName = "AlertDialogContent"

// Header component
type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement>

const AlertDialogHeader = React.forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
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
type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement>

const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(
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
type AlertDialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
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
type AlertDialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-slot="alert-dialog-description"
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
      />
    )
  }
)
AlertDialogDescription.displayName = "AlertDialogDescription"

// Action button component
type AlertDialogActionProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, ...props }, ref) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onOpenChange?.(false)}
        className={cn(buttonVariants(), className)}
        {...props}
      />
    )
  }
)
AlertDialogAction.displayName = "AlertDialogAction"

// Cancel button component
type AlertDialogCancelProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, ...props }, ref) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onOpenChange?.(false)}
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
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
