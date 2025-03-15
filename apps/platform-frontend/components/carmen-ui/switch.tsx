"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  id?: string
  className?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof SwitchProps>>(
  ({
    className,
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    required,
    name,
    value,
    id,
    ...props
  }, ref) => {
    const [checked, setChecked] = React.useState(defaultChecked)
    const isChecked = controlledChecked ?? checked

    const handleClick = React.useCallback(() => {
      if (disabled) return

      const newChecked = !isChecked

      if (controlledChecked === undefined) {
        setChecked(newChecked)
      }

      onCheckedChange?.(newChecked)
    }, [isChecked, disabled, controlledChecked, onCheckedChange])

    // Handle keyboard events
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        handleClick()
      }
    }, [handleClick])

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        data-state={isChecked ? "checked" : "unchecked"}
        data-disabled={disabled || undefined}
        data-slot="switch"
        id={id}
        disabled={disabled}
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {name && value && (
          <input
            type="checkbox"
            name={name}
            value={value}
            required={required}
            checked={isChecked}
            disabled={disabled}
            onChange={() => { }}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
        <span
          data-slot="switch-thumb"
          data-state={isChecked ? "checked" : "unchecked"}
          className={cn(
            "bg-background pointer-events-none block size-4 rounded-full ring-0 shadow-lg transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          )}
        />
      </button>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
