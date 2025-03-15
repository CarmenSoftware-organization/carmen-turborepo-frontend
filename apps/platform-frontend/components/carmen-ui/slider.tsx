"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Custom slider implementation with native HTML elements
// This replaces the Radix UI implementation to ensure React 19 compatibility

interface SliderProps {
  className?: string
  defaultValue?: number[]
  value?: number[]
  min?: number
  max?: number
  step?: number
  orientation?: "horizontal" | "vertical"
  disabled?: boolean
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof SliderProps>>(
  ({
    className,
    defaultValue,
    value: controlledValue,
    min = 0,
    max = 100,
    step = 1,
    orientation = "horizontal",
    disabled = false,
    onValueChange,
    onValueCommit,
    ...props
  }, ref) => {
    const initialValue = React.useMemo(() => {
      if (Array.isArray(controlledValue)) return controlledValue
      if (Array.isArray(defaultValue)) return defaultValue
      return [min, max]
    }, [controlledValue, defaultValue, min, max])

    const [value, setValue] = React.useState(initialValue)
    const currentValue = controlledValue ?? value

    // Calculate percentages for positioning thumbs and range
    const getPercentage = React.useCallback((val: number) => {
      return ((val - min) / (max - min)) * 100
    }, [min, max])

    return (
      <div
        ref={ref}
        data-slot="slider"
        data-orientation={orientation}
        data-disabled={disabled || undefined}
        className={cn(
          "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <div
          data-slot="slider-track"
          className={cn(
            "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
          )}
        >
          <div
            data-slot="slider-range"
            className={cn(
              "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
            )}
            style={{
              ...(orientation === "horizontal"
                ? {
                  left: `${getPercentage(Math.min(...currentValue))}%`,
                  width: `${getPercentage(Math.max(...currentValue)) - getPercentage(Math.min(...currentValue))}%`
                }
                : {
                  bottom: `${getPercentage(Math.min(...currentValue))}%`,
                  height: `${getPercentage(Math.max(...currentValue)) - getPercentage(Math.min(...currentValue))}%`
                })
            }}
          />
        </div>
        {currentValue.map((val, index) => (
          <input
            key={`slider-thumb-${val}-${index}`}
            type="range"
            data-slot="slider-thumb"
            min={min}
            max={max}
            step={step}
            value={val}
            disabled={disabled}
            aria-orientation={orientation}
            className={cn(
              "appearance-none absolute block size-4 rounded-full border border-primary bg-background shadow-sm outline-none",
              "transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50",
              "ring-ring/50"
            )}
            style={{
              margin: 0,
              position: "absolute",
              transform: "translate(-50%, -50%)",
              ...(orientation === "horizontal"
                ? { left: `${getPercentage(val)}%`, top: "50%" }
                : { left: "50%", bottom: `${getPercentage(val)}%` }),
              background: "transparent"
            }}
            onChange={(e) => {
              const newValues = [...currentValue];
              newValues[index] = parseFloat(e.target.value);

              // Sort values to ensure proper order
              if (index === 0 && newValues.length > 1) {
                newValues[0] = Math.min(newValues[0], newValues[1]);
              } else if (index === 1 && newValues.length > 1) {
                newValues[1] = Math.max(newValues[0], newValues[1]);
              }

              if (!controlledValue) {
                setValue(newValues);
              }

              onValueChange?.(newValues);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Home" || e.key === "End") {
                e.preventDefault();
                const newValues = [...currentValue];

                if (e.key === "Home") {
                  newValues[index] = min;
                } else {
                  newValues[index] = max;
                }

                if (!controlledValue) {
                  setValue(newValues);
                }

                onValueChange?.(newValues);
                onValueCommit?.(newValues);
              }
            }}
            onChangeCapture={() => onValueCommit?.(currentValue)}
          />
        ))}
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
