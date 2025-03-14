"use client"

import * as React from "react"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Create context for radio group
interface RadioGroupContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined)

function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error("Radio components must be used within a RadioGroup")
  }
  return context
}

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, defaultValue, value, onValueChange, name, children, ...props }, ref) => {
    const generatedId = React.useId()
    const actualName = name ?? generatedId
    const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)

    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const handleValueChange = React.useCallback((value: string) => {
      if (!isControlled) {
        setInternalValue(value)
      }
      onValueChange?.(value)
    }, [isControlled, onValueChange])

    const contextValue = React.useMemo(() => ({
      value: currentValue,
      onValueChange: handleValueChange,
      name: actualName
    }), [currentValue, handleValueChange, actualName])

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="radiogroup"
          data-slot="radio-group"
          className={cn("grid gap-3", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked" | "value" | "onChange" | "type"> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, ...props }, ref) => {
    const { value: groupValue, onValueChange, name } = useRadioGroupContext()
    const itemId = id ?? `radio-${value}`
    const checked = groupValue === value

    return (
      <span className="relative">
        <input
          ref={ref}
          type="radio"
          id={itemId}
          name={name}
          value={value}
          checked={checked}
          onChange={() => onValueChange(value)}
          className="sr-only peer"
          data-state={checked ? "checked" : "unchecked"}
          aria-checked={checked}
          {...props}
        />
        <label
          htmlFor={itemId}
          data-slot="radio-group-item"
          data-state={checked ? "checked" : "unchecked"}
          className={cn(
            "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 flex items-center justify-center",
            className
          )}
        >
          {checked && (
            <span data-slot="radio-group-indicator" className="relative flex items-center justify-center">
              <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
            </span>
          )}
        </label>
      </span>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
