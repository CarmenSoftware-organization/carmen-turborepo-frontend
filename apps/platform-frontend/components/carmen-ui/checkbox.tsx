"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false)

    // Handle controlled and uncontrolled checkbox
    const internalChecked = checked ?? isChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked)
      }
      onChange?.(e)
    }

    return (
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          checked={internalChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
          data-state={internalChecked ? "checked" : "unchecked"}
          {...props}
        />
        <div
          data-slot="checkbox"
          data-state={internalChecked ? "checked" : "unchecked"}
          className={cn(
            "peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 peer-focus-visible:border-ring",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
            "peer-aria-invalid:border-destructive peer-aria-invalid:ring-destructive/20 dark:peer-aria-invalid:ring-destructive/40",
            className
          )}
        >
          {internalChecked && (
            <div
              data-slot="checkbox-indicator"
              className="flex items-center justify-center text-current transition-none"
            >
              <CheckIcon className="size-3.5" />
            </div>
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
