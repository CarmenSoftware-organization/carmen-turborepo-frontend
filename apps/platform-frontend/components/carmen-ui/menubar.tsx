"use client"

import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Context to manage menubar state
interface MenubarContextValue {
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  openSub: string | null;
  setOpenSub: (id: string | null) => void;
}

const MenubarContext = React.createContext<MenubarContextValue | undefined>(undefined)

const useMenubar = () => {
  const context = React.useContext(MenubarContext)
  if (context === undefined) {
    throw new Error("useMenubar must be used within a MenubarProvider")
  }
  return context
}

// Root component
type MenubarProps = React.HTMLAttributes<HTMLDivElement>;

const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, children, ...props }, ref) => {
    const [openMenu, setOpenMenu] = React.useState<string | null>(null)
    const [openSub, setOpenSub] = React.useState<string | null>(null)

    const contextValue = React.useMemo(
      () => ({ openMenu, setOpenMenu, openSub, setOpenSub }),
      [openMenu, setOpenMenu, openSub, setOpenSub]
    );

    return (
      <MenubarContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="menubar"
          className={cn(
            "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
            className
          )}
          role="menubar"
          aria-orientation="horizontal"
          {...props}
        >
          {children}
        </div>
      </MenubarContext.Provider>
    )
  }
)
Menubar.displayName = "Menubar"

// Menu component
interface MenubarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const MenubarMenu = React.forwardRef<HTMLDivElement, MenubarMenuProps>(
  ({ id, className, children, ...props }, ref) => {
    const { openMenu } = useMenubar()
    const isOpen = openMenu === id

    return (
      <div
        ref={ref}
        data-slot="menubar-menu"
        data-state={isOpen ? "open" : "closed"}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MenubarMenu.displayName = "MenubarMenu"

// Group component
type MenubarGroupProps = React.HTMLAttributes<HTMLFieldSetElement>;

const MenubarGroup = React.forwardRef<HTMLFieldSetElement, MenubarGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        data-slot="menubar-group"
        className={className}
        {...props}
      />
    )
  }
)
MenubarGroup.displayName = "MenubarGroup"

// Portal component
interface MenubarPortalProps {
  children: React.ReactNode;
}

const MenubarPortal = ({ children }: MenubarPortalProps) => {
  return <div data-slot="menubar-portal">{children}</div>
}
MenubarPortal.displayName = "MenubarPortal"

// RadioGroup component
interface MenubarRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

const MenubarRadioGroup = React.forwardRef<HTMLDivElement, MenubarRadioGroupProps>(
  ({ className, children, value, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value)

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value)
      }
    }, [value])

    return (
      <div
        ref={ref}
        data-slot="menubar-radio-group"
        role="radiogroup"
        data-value={selectedValue}
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MenubarRadioGroup.displayName = "MenubarRadioGroup"

// Trigger component
interface MenubarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  menuId: string;
}

const MenubarTrigger = React.forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  ({ className, children, menuId, ...props }, ref) => {
    const { openMenu, setOpenMenu } = useMenubar()
    const isOpen = openMenu === menuId

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      setOpenMenu(isOpen ? null : menuId)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpenMenu(isOpen ? null : menuId)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="menubar-trigger"
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
          className
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`content-${menuId}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    )
  }
)
MenubarTrigger.displayName = "MenubarTrigger"

// Content component
interface MenubarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  menuId: string;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  sideOffset?: number;
}

const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  ({ className, menuId, align = "start", alignOffset = -4, sideOffset = 8, children, ...props }, ref) => {
    const { openMenu } = useMenubar()
    const isOpen = openMenu === menuId

    if (!isOpen) return null

    return (
      <MenubarPortal>
        <div
          ref={ref}
          id={`content-${menuId}`}
          data-slot="menubar-content"
          data-state={isOpen ? "open" : "closed"}
          data-align={align}
          data-align-offset={alignOffset}
          data-side-offset={sideOffset}
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-md absolute",
            className
          )}
          role="menu"
          aria-orientation="vertical"
          style={{
            [align === "end" ? "right" : "left"]: `${alignOffset}px`,
            top: `calc(100% + ${sideOffset}px)`,
          }}
          {...props}
        >
          {children}
        </div>
      </MenubarPortal>
    )
  }
)
MenubarContent.displayName = "MenubarContent"

// Item component
interface MenubarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  variant?: "default" | "destructive";
}

const MenubarItem = React.forwardRef<HTMLButtonElement, MenubarItemProps>(
  ({ className, inset, variant = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        data-slot="menubar-item"
        data-inset={inset}
        data-variant={variant}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:*:[svg]:!text-destructive-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full text-left",
          className
        )}
        role="menuitem"
        {...props}
      >
        {children}
      </button>
    )
  }
)
MenubarItem.displayName = "MenubarItem"

// CheckboxItem component
interface MenubarCheckboxItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "checked" | "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const MenubarCheckboxItem = React.forwardRef<HTMLButtonElement, MenubarCheckboxItemProps>(
  ({ className, children, checked, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false)

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked)
      }
    }, [checked])

    const handleClick = () => {
      const newState = !isChecked
      setIsChecked(newState)
      onChange?.(newState)
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="menubar-checkbox-item"
        role="menuitemcheckbox"
        aria-checked={isChecked}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full text-left",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          {isChecked && <CheckIcon className="size-4" />}
        </span>
        {children}
      </button>
    )
  }
)
MenubarCheckboxItem.displayName = "MenubarCheckboxItem"

// RadioItem component
interface MenubarRadioItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "checked" | "onChange" | "value"> {
  checked?: boolean;
  value: string;
  onChange?: () => void;
}

const MenubarRadioItem = React.forwardRef<HTMLButtonElement, MenubarRadioItemProps>(
  ({ className, children, checked, value, onChange, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        data-slot="menubar-radio-item"
        role="menuitemradio"
        aria-checked={checked}
        data-value={value}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full text-left",
          className
        )}
        onClick={onChange}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          {checked && <CircleIcon className="size-2 fill-current" />}
        </span>
        {children}
      </button>
    )
  }
)
MenubarRadioItem.displayName = "MenubarRadioItem"

// Label component
interface MenubarLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

const MenubarLabel = React.forwardRef<HTMLDivElement, MenubarLabelProps>(
  ({ className, inset, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="menubar-label"
        data-inset={inset}
        className={cn(
          "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
          className
        )}
        {...props}
      />
    )
  }
)
MenubarLabel.displayName = "MenubarLabel"

// Separator component
const MenubarSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        data-slot="menubar-separator"
        className={cn("bg-border -mx-1 my-1 h-px", className)}
        {...props}
      />
    )
  }
)
MenubarSeparator.displayName = "MenubarSeparator"

// Shortcut component
type MenubarShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

const MenubarShortcut = React.forwardRef<HTMLSpanElement, MenubarShortcutProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="menubar-shortcut"
        className={cn(
          "text-muted-foreground ml-auto text-xs tracking-widest",
          className
        )}
        {...props}
      />
    )
  }
)
MenubarShortcut.displayName = "MenubarShortcut"

// Sub components
interface MenubarSubProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
}

const MenubarSub = React.forwardRef<HTMLDivElement, MenubarSubProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="menubar-sub"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MenubarSub.displayName = "MenubarSub"

// SubTrigger component
interface MenubarSubTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  subId: string;
  inset?: boolean;
}

const MenubarSubTrigger = React.forwardRef<HTMLButtonElement, MenubarSubTriggerProps>(
  ({ className, subId, inset, children, ...props }, ref) => {
    const { openSub, setOpenSub } = useMenubar()
    const isOpen = openSub === subId

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      setOpenSub(isOpen ? null : subId)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpenSub(isOpen ? null : subId)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="menubar-sub-trigger"
        data-inset={inset}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8 w-full text-left",
          className
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`subcontent-${subId}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
        <ChevronRightIcon className="ml-auto h-4 w-4" />
      </button>
    )
  }
)
MenubarSubTrigger.displayName = "MenubarSubTrigger"

// SubContent component
interface MenubarSubContentProps extends React.HTMLAttributes<HTMLDivElement> {
  subId: string;
}

const MenubarSubContent = React.forwardRef<HTMLDivElement, MenubarSubContentProps>(
  ({ className, subId, children, ...props }, ref) => {
    const { openSub } = useMenubar()
    const isOpen = openSub === subId

    if (!isOpen) return null

    return (
      <div
        ref={ref}
        id={`subcontent-${subId}`}
        data-slot="menubar-sub-content"
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg absolute left-full top-0 ml-1",
          className
        )}
        role="menu"
        aria-orientation="vertical"
        {...props}
      >
        {children}
      </div>
    )
  }
)
MenubarSubContent.displayName = "MenubarSubContent"

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
