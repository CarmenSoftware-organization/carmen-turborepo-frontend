"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Context to manage navigation menu state
interface NavigationMenuContextValue {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  viewport: boolean;
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue | undefined>(undefined)

const useNavigationMenu = () => {
  const context = React.useContext(NavigationMenuContext)
  if (context === undefined) {
    throw new Error("useNavigationMenu must be used within a NavigationMenu")
  }
  return context
}

// Root component
interface NavigationMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  viewport?: boolean;
}

const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  ({ className, children, viewport = true, ...props }, ref) => {
    const [activeItem, setActiveItem] = React.useState<string | null>(null)

    const contextValue = React.useMemo(
      () => ({ activeItem, setActiveItem, viewport }),
      [activeItem, setActiveItem, viewport]
    );

    return (
      <NavigationMenuContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="navigation-menu"
          data-viewport={viewport}
          className={cn(
            "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
            className
          )}
          {...props}
        >
          {children}
          {viewport && <NavigationMenuViewport />}
        </div>
      </NavigationMenuContext.Provider>
    )
  }
)
NavigationMenu.displayName = "NavigationMenu"

// List component
type NavigationMenuListProps = React.HTMLAttributes<HTMLUListElement>;

const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        data-slot="navigation-menu-list"
        className={cn(
          "group flex flex-1 list-none items-center justify-center gap-1",
          className
        )}
        {...props}
      />
    )
  }
)
NavigationMenuList.displayName = "NavigationMenuList"

// Item component
interface NavigationMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value?: string;
}

const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <li
        ref={ref}
        data-slot="navigation-menu-item"
        data-value={value}
        className={cn("relative", className)}
        role="none"
        {...props}
      />
    )
  }
)
NavigationMenuItem.displayName = "NavigationMenuItem"

// Style definition
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1"
)

// Trigger component
interface NavigationMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  contentId: string;
}

const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  ({ className, children, contentId, ...props }, ref) => {
    const { activeItem, setActiveItem } = useNavigationMenu()
    const isOpen = activeItem === contentId

    const handleClick = () => {
      setActiveItem(isOpen ? null : contentId)
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="navigation-menu-trigger"
        data-state={isOpen ? "open" : "closed"}
        className={cn(navigationMenuTriggerStyle(), "group", className)}
        aria-expanded={isOpen}
        aria-controls={`content-${contentId}`}
        onClick={handleClick}
        {...props}
      >
        {children}{" "}
        <ChevronDownIcon
          className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </button>
    )
  }
)
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

// Content component
interface NavigationMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  contentId: string;
}

const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ className, contentId, children, ...props }, ref) => {
    const { activeItem, viewport } = useNavigationMenu()
    const isOpen = activeItem === contentId

    if (!isOpen) return null

    return (
      <div
        ref={ref}
        id={`content-${contentId}`}
        data-slot="navigation-menu-content"
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
          "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
          className
        )}
        role={viewport ? "none" : "menu"}
        {...props}
      >
        {children}
      </div>
    )
  }
)
NavigationMenuContent.displayName = "NavigationMenuContent"

// Viewport component
type NavigationMenuViewportProps = React.HTMLAttributes<HTMLDivElement>;

const NavigationMenuViewport = React.forwardRef<HTMLDivElement, NavigationMenuViewportProps>(
  ({ className, ...props }, ref) => {
    const { activeItem } = useNavigationMenu()
    const isActive = activeItem !== null

    return (
      <div
        className={cn(
          "absolute top-full left-0 isolate z-50 flex justify-center"
        )}
      >
        <div
          ref={ref}
          data-slot="navigation-menu-viewport"
          data-state={isActive ? "open" : "closed"}
          className={cn(
            "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
            className
          )}
          style={{
            height: isActive ? "var(--radix-navigation-menu-viewport-height, auto)" : "0",
            width: "var(--radix-navigation-menu-viewport-width, auto)"
          }}
          {...props}
        />
      </div>
    )
  }
)
NavigationMenuViewport.displayName = "NavigationMenuViewport"

// Link component
interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        data-slot="navigation-menu-link"
        data-active={active}
        className={cn(
          "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        role="menuitem"
        {...props}
      >
        {children}
      </a>
    )
  }
)
NavigationMenuLink.displayName = "NavigationMenuLink"

// Indicator component
type NavigationMenuIndicatorProps = React.HTMLAttributes<HTMLDivElement>;

const NavigationMenuIndicator = React.forwardRef<HTMLDivElement, NavigationMenuIndicatorProps>(
  ({ className, ...props }, ref) => {
    const { activeItem } = useNavigationMenu()
    const isVisible = activeItem !== null

    return (
      <div
        ref={ref}
        data-slot="navigation-menu-indicator"
        data-state={isVisible ? "visible" : "hidden"}
        className={cn(
          "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
          className
        )}
        aria-hidden="true"
        {...props}
      >
        <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
      </div>
    )
  }
)
NavigationMenuIndicator.displayName = "NavigationMenuIndicator"

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
