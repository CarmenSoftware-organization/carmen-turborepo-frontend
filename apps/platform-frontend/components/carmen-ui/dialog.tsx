"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Dialog context to manage state and accessibility
interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  contentId: string
  titleId: string
  descriptionId: string
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined)

const useDialog = () => {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("useDialog must be used within a Dialog")
  }
  return context
}

// Component props interfaces
interface DialogProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dialog = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen

  const contentId = React.useId() + "-content"
  const titleId = React.useId() + "-title"
  const descriptionId = React.useId() + "-description"

  const setOpen = React.useCallback((value: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(value)
    }
    onOpenChange?.(value)
  }, [controlledOpen, onOpenChange])

  const contextValue = React.useMemo(
    () => ({ open, setOpen, contentId, titleId, descriptionId }),
    [open, setOpen, contentId, titleId, descriptionId]
  )

  return (
    <DialogContext.Provider value={contextValue}>
      <div data-slot="dialog">{children}</div>
    </DialogContext.Provider>
  )
}

// Trigger component
type DialogTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, ...props }, ref) => {
    const { setOpen, contentId } = useDialog()

    const handleClick = () => {
      setOpen(true)
    }

    return (
      <button
        type="button"
        ref={ref}
        data-slot="dialog-trigger"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls={contentId}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DialogTrigger.displayName = "DialogTrigger"

// Portal component for rendering outside DOM hierarchy
interface DialogPortalProps {
  children?: React.ReactNode
}

const DialogPortal = ({ children }: DialogPortalProps) => {
  return <div data-slot="dialog-portal">{children}</div>
}

// Close button component
type DialogCloseProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, ...props }, ref) => {
    const { setOpen } = useDialog()

    const handleClick = () => {
      setOpen(false)
    }

    return (
      <button
        type="button"
        ref={ref}
        data-slot="dialog-close"
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DialogClose.displayName = "DialogClose"

// Overlay component
const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open } = useDialog()

    if (!open) return null

    return (
      <div
        ref={ref}
        data-slot="dialog-overlay"
        data-state={open ? "open" : "closed"}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
          className
        )}
        {...props}
      />
    )
  }
)
DialogOverlay.displayName = "DialogOverlay"

// Content component
const DialogContent = React.forwardRef<HTMLDialogElement, React.HTMLAttributes<HTMLDialogElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, contentId, titleId, descriptionId, setOpen } = useDialog()

    // Handle escape key to close dialog
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          setOpen(false)
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [open, setOpen])

    if (!open) return null

    return (
      <DialogPortal>
        <DialogOverlay />
        <dialog
          ref={ref}
          id={contentId}
          data-slot="dialog-content"
          data-state={open ? "open" : "closed"}
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            className
          )}
          {...props}
        >
          {children}
          <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>
        </dialog>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = "DialogContent"

// Header component
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

// Footer component
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

// Title component
const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    const { titleId } = useDialog()

    return (
      <h2
        ref={ref}
        id={titleId}
        data-slot="dialog-title"
        className={cn("text-lg leading-none font-semibold", className)}
        {...props}
      >
        {children}
      </h2>
    )
  }
)
DialogTitle.displayName = "DialogTitle"

// Description component
const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { descriptionId } = useDialog()

    return (
      <p
        ref={ref}
        id={descriptionId}
        data-slot="dialog-description"
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
      />
    )
  }
)
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
