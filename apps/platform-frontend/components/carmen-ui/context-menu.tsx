"use client"

import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Context menu context to manage state
interface ContextMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  x: number
  y: number
  setPosition: (x: number, y: number) => void
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | undefined>(undefined)

const useContextMenu = () => {
  const context = React.useContext(ContextMenuContext)
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenu")
  }
  return context
}

// Component interfaces
interface ContextMenuProps {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

const ContextMenu = ({
  children,
  onOpenChange,
}: ContextMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }, [onOpenChange])

  const contextValue = React.useMemo(() => ({
    open,
    setOpen: handleOpenChange,
    x: position.x,
    y: position.y,
    setPosition: (x: number, y: number) => setPosition({ x, y }),
  }), [open, handleOpenChange, position.x, position.y])

  return (
    <ContextMenuContext.Provider value={contextValue}>
      <div data-slot="context-menu">{children}</div>
    </ContextMenuContext.Provider>
  )
}

// Trigger component

const ContextMenuTrigger = React.forwardRef<HTMLButtonElement, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onContextMenu'>>(
  ({ children, ...props }, ref) => {
    const { setOpen, setPosition } = useContextMenu()

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault()
      setPosition(e.clientX, e.clientY)
      setOpen(true)
    }

    return (
      <button
        type="button"
        ref={ref}
        data-slot="context-menu-trigger"
        aria-haspopup="menu"
        onContextMenu={handleContextMenu}
        onKeyDown={(e) => {
          if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            setPosition(rect.left, rect.top);
            setOpen(true);
          }
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ContextMenuTrigger.displayName = "ContextMenuTrigger"

// Group component
type ContextMenuGroupProps = React.HTMLAttributes<HTMLDivElement>;

const ContextMenuGroup = React.forwardRef<HTMLDivElement, ContextMenuGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="context-menu-group"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContextMenuGroup.displayName = "ContextMenuGroup"

// Portal component
interface ContextMenuPortalProps {
  children: React.ReactNode
}

const ContextMenuPortal = ({ children }: ContextMenuPortalProps) => {
  return <div data-slot="context-menu-portal">{children}</div>
}

// Sub-menu context
interface ContextMenuSubContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const ContextMenuSubContext = React.createContext<ContextMenuSubContextValue | undefined>(undefined)

const useContextMenuSub = () => {
  const context = React.useContext(ContextMenuSubContext)
  if (!context) {
    throw new Error("useContextMenuSub must be used within a ContextMenuSub")
  }
  return context
}

// Sub component
interface ContextMenuSubProps {
  children: React.ReactNode
}

const ContextMenuSub = ({ children }: ContextMenuSubProps) => {
  const [open, setOpen] = React.useState(false)

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
  }), [open])

  return (
    <ContextMenuSubContext.Provider value={contextValue}>
      <div data-slot="context-menu-sub">{children}</div>
    </ContextMenuSubContext.Provider>
  )
}

// Radio group component
interface ContextMenuRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
}

const ContextMenuRadioGroup = React.forwardRef<HTMLDivElement, ContextMenuRadioGroupProps>(
  ({ children, className, value, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value ?? "")

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value)
      }
    }, [value])

    return (
      <div
        ref={ref}
        data-slot="context-menu-radio-group"
        data-value={selectedValue}
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup"

// Sub trigger component
interface ContextMenuSubTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

const ContextMenuSubTrigger = React.forwardRef<HTMLDivElement, ContextMenuSubTriggerProps>(
  ({ children, className, inset, ...props }, ref) => {
    const { setOpen } = useContextMenuSub()

    return (
      <div
        ref={ref}
        data-slot="context-menu-sub-trigger"
        data-inset={inset}
        role="menuitem"
        tabIndex={0}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        {...props}
      >
        {children}
        <ChevronRightIcon className="ml-auto" />
      </div>
    )
  }
)
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

// Sub content component
type ContextMenuSubContentProps = React.HTMLAttributes<HTMLDivElement>;

const ContextMenuSubContent = React.forwardRef<HTMLDivElement, ContextMenuSubContentProps>(
  ({ children, className, ...props }, ref) => {
    const { open } = useContextMenuSub()

    if (!open) return null

    return (
      <div
        ref={ref}
        data-slot="context-menu-sub-content"
        data-state={open ? "open" : "closed"}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContextMenuSubContent.displayName = "ContextMenuSubContent"

// Content component
type ContextMenuContentProps = React.HTMLAttributes<HTMLDivElement>;

const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ children, className, ...props }, ref) => {
    const { open, x, y, setOpen } = useContextMenu()
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open, setOpen])

    if (!open) return null

    return (
      <ContextMenuPortal>
        <div
          ref={ref}
          data-slot="context-menu-content"
          data-state={open ? "open" : "closed"}
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
            "fixed"
          )}
          style={{ top: y, left: x }}
          {...props}
        >
          <div ref={contentRef} className={className}>
            {children}
          </div>
        </div>
      </ContextMenuPortal>
    )
  }
)
ContextMenuContent.displayName = "ContextMenuContent"

// Menu item component
interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  variant?: "default" | "destructive"
}

const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ children, className, inset, variant = "default", ...props }, ref) => {
    const { setOpen } = useContextMenu()

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (props.onClick) {
        props.onClick(e)
      }
      setOpen(false)
    }

    return (
      <div
        ref={ref}
        data-slot="context-menu-item"
        data-inset={inset}
        data-variant={variant}
        role="menuitem"
        tabIndex={0}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick({
              ...e,
              type: 'click',
              currentTarget: e.currentTarget,
              target: e.target,
              preventDefault: () => { },
              stopPropagation: () => { }
            } as unknown as React.MouseEvent<HTMLDivElement>)
          }
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContextMenuItem.displayName = "ContextMenuItem"

// Checkbox item component
interface ContextMenuCheckboxItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'checked' | 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const ContextMenuCheckboxItem = React.forwardRef<HTMLDivElement, ContextMenuCheckboxItemProps>(
  ({ children, className, checked, onCheckedChange, ...props }, ref) => {
    const handleClick = () => {
      onCheckedChange?.(!checked)
    }

    return (
      <div
        ref={ref}
        data-slot="context-menu-checkbox-item"
        role="menuitemcheckbox"
        aria-checked={checked}
        tabIndex={0}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          {checked && <CheckIcon className="size-4" />}
        </span>
        {children}
      </div>
    )
  }
)
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

// Radio item component
interface ContextMenuRadioItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'checked' | 'onChange'> {
  value: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const ContextMenuRadioItem = React.forwardRef<HTMLDivElement, ContextMenuRadioItemProps>(
  ({ children, className, value, checked, onCheckedChange, ...props }, ref) => {
    const handleClick = () => {
      onCheckedChange?.(true)
    }

    return (
      <div
        ref={ref}
        data-slot="context-menu-radio-item"
        role="menuitemradio"
        aria-checked={checked}
        data-value={value}
        tabIndex={0}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          {checked && <CircleIcon className="size-2 fill-current" />}
        </span>
        {children}
      </div>
    )
  }
)
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"

// Label component
interface ContextMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

const ContextMenuLabel = React.forwardRef<HTMLDivElement, ContextMenuLabelProps>(
  ({ className, inset, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="context-menu-label"
        data-inset={inset}
        className={cn(
          "text-foreground px-2 py-1.5 text-sm font-semibold data-[inset]:pl-8",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContextMenuLabel.displayName = "ContextMenuLabel"

// Separator component
type ContextMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="context-menu-separator"
        className={cn("bg-border -mx-1 my-1 h-px", className)}
        {...props}
      />
    )
  }
)
ContextMenuSeparator.displayName = "ContextMenuSeparator"

// Shortcut component
type ContextMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

const ContextMenuShortcut = React.forwardRef<HTMLSpanElement, ContextMenuShortcutProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="context-menu-shortcut"
        className={cn(
          "text-muted-foreground ml-auto text-xs tracking-widest",
          className
        )}
        {...props}
      />
    )
  }
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
