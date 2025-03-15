"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/carmen-ui/toggle"

// Context for sharing values and variant props
interface ToggleGroupContextValue {
  type: "single" | "multiple"
  variant?: VariantProps<typeof toggleVariants>["variant"]
  size?: VariantProps<typeof toggleVariants>["size"]
  value: string | string[]
  onValueChange: (value: string) => void
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | undefined>(undefined)

// Props interfaces
interface ToggleGroupProps {
  type: "single" | "multiple"
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  disabled?: boolean
  variant?: VariantProps<typeof toggleVariants>["variant"]
  size?: VariantProps<typeof toggleVariants>["size"]
  className?: string
  children?: React.ReactNode
}

// Implementation that handles both types
const ToggleGroup = React.forwardRef<HTMLDivElement | HTMLFieldSetElement, ToggleGroupProps & Omit<React.HTMLAttributes<HTMLDivElement | HTMLFieldSetElement>, keyof ToggleGroupProps>>(
  ({
    type,
    value: controlledValue,
    defaultValue,
    onValueChange,
    disabled = false,
    variant = "default",
    size = "default",
    className,
    children,
    ...props
  }, ref) => {
    // Set up controlled/uncontrolled state
    const [value, setValue] = React.useState<string | string[]>(() => {
      if (type === "single") {
        return defaultValue as string || ""
      }
      return defaultValue as string[] || []
    })

    const currentValue = controlledValue ?? value

    const handleValueChange = React.useCallback((itemValue: string) => {
      if (disabled) return

      let newValue: string | string[]

      if (type === "single") {
        newValue = itemValue
      } else {
        // Multiple selection logic
        const currentValueArray = Array.isArray(currentValue) ? currentValue : [currentValue]
        newValue = currentValueArray.includes(itemValue)
          ? currentValueArray.filter(v => v !== itemValue)
          : [...currentValueArray, itemValue]
      }

      if (controlledValue === undefined) {
        setValue(newValue)
      }

      onValueChange?.(newValue)
    }, [type, disabled, currentValue, controlledValue, onValueChange])

    // Create context value
    const contextValue = React.useMemo(() => ({
      type,
      variant,
      size,
      value: currentValue,
      onValueChange: handleValueChange
    }), [type, variant, size, currentValue, handleValueChange])

    // Use the appropriate component based on type
    if (type === "multiple") {
      return (
        <ToggleGroupMultiple
          ref={ref as React.Ref<HTMLFieldSetElement>}
          contextValue={contextValue}
          disabled={disabled}
          variant={variant}
          size={size}
          className={className}
          {...props}
        >
          {children}
        </ToggleGroupMultiple>
      )
    }

    return (
      <ToggleGroupSingle
        ref={ref as React.Ref<HTMLDivElement>}
        contextValue={contextValue}
        disabled={disabled}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        {children}
      </ToggleGroupSingle>
    )
  }
)

ToggleGroup.displayName = "ToggleGroup"

// Internal components for the two different types
interface ToggleGroupBaseProps {
  contextValue: ToggleGroupContextValue
  disabled?: boolean
  variant: VariantProps<typeof toggleVariants>["variant"]
  size: VariantProps<typeof toggleVariants>["size"]
  className?: string
  children?: React.ReactNode
}

const ToggleGroupMultiple = React.forwardRef<
  HTMLFieldSetElement,
  ToggleGroupBaseProps & Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, keyof ToggleGroupBaseProps>
>(({ contextValue, disabled, variant, size, className, children, ...props }, ref) => {
  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <fieldset
        ref={ref}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        data-type="multiple"
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        className={cn(
          "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs border-0 m-0 p-0",
          className
        )}
        {...props}
      >
        {children}
      </fieldset>
    </ToggleGroupContext.Provider>
  )
})

ToggleGroupMultiple.displayName = "ToggleGroupMultiple"

const ToggleGroupSingle = React.forwardRef<
  HTMLDivElement,
  ToggleGroupBaseProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof ToggleGroupBaseProps>
>(({ contextValue, disabled, variant, size, className, children, ...props }, ref) => {
  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        data-type="single"
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        className={cn(
          "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
})

ToggleGroupSingle.displayName = "ToggleGroupSingle"

interface ToggleGroupItemProps {
  value: string
  disabled?: boolean
  className?: string
  variant?: VariantProps<typeof toggleVariants>["variant"]
  size?: VariantProps<typeof toggleVariants>["size"]
  children?: React.ReactNode
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ToggleGroupItemProps>>(
  ({
    value,
    disabled = false,
    className,
    children,
    variant,
    size
  }, ref) => {
    const context = React.useContext(ToggleGroupContext)

    if (!context) {
      throw new Error("ToggleGroupItem must be used within a ToggleGroup")
    }

    const { type, value: groupValue, onValueChange, variant: groupVariant, size: groupSize } = context

    const isSelected = type === "single"
      ? groupValue === value
      : Array.isArray(groupValue) && groupValue.includes(value)

    if (type === "multiple") {
      // Render checkbox version for multiple selection
      return (
        <ToggleGroupItemCheckbox
          value={value}
          isSelected={isSelected}
          disabled={disabled}
          className={className}
          variant={variant ?? groupVariant}
          size={size ?? groupSize}
          onValueChange={onValueChange}
        >
          {children}
        </ToggleGroupItemCheckbox>
      )
    }

    // Render radio version for single selection
    return (
      <ToggleGroupItemRadio
        ref={ref as React.Ref<HTMLInputElement>}
        value={value}
        isSelected={isSelected}
        disabled={disabled}
        className={className}
        variant={variant ?? groupVariant}
        size={size ?? groupSize}
        onValueChange={onValueChange}
        name={typeof groupValue === 'string' ? groupValue : 'toggle-group'}
      >
        {children}
      </ToggleGroupItemRadio>
    )
  }
)

ToggleGroupItem.displayName = "ToggleGroupItem"

// Additional component for checkbox implementation
interface ToggleGroupItemCheckboxProps {
  value: string
  isSelected: boolean
  disabled?: boolean
  className?: string
  variant?: VariantProps<typeof toggleVariants>["variant"]
  size?: VariantProps<typeof toggleVariants>["size"]
  onValueChange: (value: string) => void
  children?: React.ReactNode
}

const ToggleGroupItemCheckbox: React.FC<ToggleGroupItemCheckboxProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof ToggleGroupItemCheckboxProps>> = ({
  value,
  isSelected,
  disabled = false,
  className,
  children,
  variant,
  size,
  onValueChange,
  ...props
}) => {
  return (
    <label
      className={cn(
        toggleVariants({
          variant,
          size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus-within:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        isSelected ? "bg-accent text-accent-foreground" : "",
        disabled ? "pointer-events-none opacity-50" : "",
        "inline-flex items-center justify-center gap-2 cursor-pointer",
        className
      )}
      data-state={isSelected ? "on" : "off"}
      data-disabled={disabled || undefined}
      data-slot="toggle-group-item"
      data-variant={variant}
      data-size={size}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={isSelected}
        disabled={disabled}
        onChange={() => onValueChange(value)}
        {...props}
      />
      {children}
    </label>
  )
}

// Additional component for radio implementation
interface ToggleGroupItemRadioProps {
  value: string
  isSelected: boolean
  disabled?: boolean
  className?: string
  variant?: VariantProps<typeof toggleVariants>["variant"]
  size?: VariantProps<typeof toggleVariants>["size"]
  onValueChange: (value: string) => void
  name: string
  children?: React.ReactNode
}

const ToggleGroupItemRadio = React.forwardRef<HTMLInputElement, ToggleGroupItemRadioProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof ToggleGroupItemRadioProps>>(
  ({
    value,
    isSelected,
    disabled = false,
    className,
    children,
    variant,
    size,
    onValueChange,
    name,
    ...props
  }, ref) => {
    return (
      <label
        className={cn(
          toggleVariants({
            variant,
            size,
          }),
          "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus-within:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
          isSelected ? "bg-accent text-accent-foreground" : "",
          disabled ? "pointer-events-none opacity-50" : "",
          "inline-flex items-center justify-center gap-2 cursor-pointer",
          className
        )}
        data-state={isSelected ? "on" : "off"}
        data-disabled={disabled || undefined}
        data-slot="toggle-group-item"
        data-variant={variant}
        data-size={size}
      >
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          className="sr-only"
          checked={isSelected}
          disabled={disabled}
          onChange={() => onValueChange(value)}
          {...props}
        />
        {children}
      </label>
    )
  }
)

ToggleGroupItemRadio.displayName = "ToggleGroupItemRadio"

export { ToggleGroup, ToggleGroupItem }
