"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Define context to manage tabs state
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

// Define props interfaces for each component
interface TabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: "horizontal" | "vertical"
  dir?: "ltr" | "rtl"
  className?: string
  children?: React.ReactNode
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof TabsProps>>(
  ({
    value: controlledValue,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    dir,
    className,
    children,
    ...props
  }, ref) => {
    // Handle controlled and uncontrolled state
    const [value, setValue] = React.useState(defaultValue ?? "")
    const currentValue = controlledValue ?? value

    const handleValueChange = React.useCallback((newValue: string) => {
      if (controlledValue === undefined) {
        setValue(newValue)
      }
      onValueChange?.(newValue)
    }, [controlledValue, onValueChange])

    // Create context value
    const contextValue = React.useMemo(() => ({
      value: currentValue,
      onValueChange: handleValueChange
    }), [currentValue, handleValueChange])

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="tabs"
          data-orientation={orientation}
          data-state={currentValue ? "active" : "inactive"}
          dir={dir}
          className={cn("flex flex-col gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = "Tabs"

interface TabsListProps {
  className?: string
  children?: React.ReactNode
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof TabsListProps>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        data-slot="tabs-list"
        className={cn(
          "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabsList.displayName = "TabsList"

interface TabsTriggerProps {
  value: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof TabsTriggerProps>>(
  ({ className, value, disabled = false, children, ...props }, ref) => {
    const context = React.useContext(TabsContext)

    if (!context) {
      throw new Error("TabsTrigger must be used within a Tabs component")
    }

    const { value: selectedValue, onValueChange } = context
    const isSelected = selectedValue === value

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        aria-controls={`panel-${value}`}
        data-state={isSelected ? "active" : "inactive"}
        data-slot="tabs-trigger"
        data-disabled={disabled || undefined}
        disabled={disabled}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => onValueChange(value)}
        className={cn(
          "data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps {
  value: string
  forceMount?: boolean
  className?: string
  children?: React.ReactNode
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof TabsContentProps>>(
  ({ className, value, forceMount, children, ...props }, ref) => {
    const context = React.useContext(TabsContext)

    if (!context) {
      throw new Error("TabsContent must be used within a Tabs component")
    }

    const { value: selectedValue } = context
    const isSelected = selectedValue === value

    if (!forceMount && !isSelected) {
      return null
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`panel-${value}`}
        aria-labelledby={`trigger-${value}`}
        data-state={isSelected ? "active" : "inactive"}
        data-slot="tabs-content"
        hidden={!isSelected}
        className={cn("flex-1 outline-none", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
