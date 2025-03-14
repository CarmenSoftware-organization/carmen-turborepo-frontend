"use client"

import * as React from "react"
import { MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Create a custom context for our OTP Input
interface InputOTPContextValue {
  value: string;
  setValue: (value: string) => void;
  slots: {
    char: string;
    isActive: boolean;
    hasFakeCaret: boolean;
  }[];
  activeSlot: number;
  setActiveSlot: (index: number) => void;
  maxLength: number;
}

const InputOTPContext = React.createContext<InputOTPContextValue | undefined>(undefined)

const useInputOTP = () => {
  const context = React.useContext(InputOTPContext)
  if (!context) {
    throw new Error("useInputOTP must be used within an InputOTP component")
  }
  return context
}

// InputOTP component
interface InputOTPProps {
  className?: string;
  containerClassName?: string;
  maxLength: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  onComplete?: (value: string) => void;
  pattern?: string;
  placeholder?: string;
  children: React.ReactNode;
}

const InputOTP = React.forwardRef<HTMLButtonElement, InputOTPProps>(
  ({
    containerClassName,
    maxLength,
    value = "",
    onChange,
    onComplete,
    disabled = false,
    children,
    className,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const [activeSlot, setActiveSlot] = React.useState<number>(-1);

    // Update internal value when external value changes
    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleValueChange = React.useCallback((newValue: string) => {
      setInternalValue(newValue);
      onChange?.(newValue);

      // Check if the OTP is complete
      if (newValue.length === maxLength) {
        onComplete?.(newValue);
      }
    }, [maxLength, onChange, onComplete]);

    // Create slots array for context
    const slots = React.useMemo(() => {
      return Array.from({ length: maxLength }, (_, i) => ({
        char: internalValue[i] || "",
        isActive: i === activeSlot,
        hasFakeCaret: i === activeSlot
      }));
    }, [internalValue, activeSlot, maxLength]);

    // Context value
    const contextValue = React.useMemo(() => ({
      value: internalValue,
      setValue: handleValueChange,
      slots,
      activeSlot,
      setActiveSlot,
      maxLength
    }), [internalValue, handleValueChange, slots, activeSlot, maxLength]);

    // Handle keyboard input
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      // Handle digit keys
      if (/^\d$/.test(e.key) && activeSlot >= 0 && activeSlot < maxLength) {
        e.preventDefault();
        const newValue = internalValue.slice(0, activeSlot) + e.key + internalValue.slice(activeSlot + 1);
        handleValueChange(newValue);

        // Move to next slot if available
        if (activeSlot < maxLength - 1) {
          setActiveSlot(activeSlot + 1);
        }
      }

      // Handle backspace
      if (e.key === "Backspace" && activeSlot >= 0) {
        e.preventDefault();
        const newValue = internalValue.slice(0, activeSlot) + "" + internalValue.slice(activeSlot + 1);
        handleValueChange(newValue);

        // Move to previous slot if available
        if (activeSlot > 0) {
          setActiveSlot(activeSlot - 1);
        }
      }

      // Handle arrow keys
      if (e.key === "ArrowLeft" && activeSlot > 0) {
        e.preventDefault();
        setActiveSlot(activeSlot - 1);
      }

      if (e.key === "ArrowRight" && activeSlot < maxLength - 1) {
        e.preventDefault();
        setActiveSlot(activeSlot + 1);
      }
    }, [activeSlot, disabled, handleValueChange, internalValue, maxLength]);

    return (
      <InputOTPContext.Provider value={contextValue}>
        <button
          type="button"
          ref={ref}
          data-slot="input-otp"
          aria-label="One-time password input"
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 text-left w-full border-0 bg-transparent",
            disabled && "opacity-50 cursor-not-allowed",
            containerClassName,
            className
          )}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </button>
      </InputOTPContext.Provider>
    )
  }
)
InputOTP.displayName = "InputOTP"

// InputOTPGroup component
const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
})
InputOTPGroup.displayName = "InputOTPGroup"

// InputOTPSlot component
interface InputOTPSlotProps extends React.HTMLAttributes<HTMLButtonElement> {
  index: number;
}

const InputOTPSlot = React.forwardRef<HTMLButtonElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const { slots, setActiveSlot } = useInputOTP();
    const { char, isActive, hasFakeCaret } = slots[index] || { char: "", isActive: false, hasFakeCaret: false };

    const handleClick = () => {
      setActiveSlot(index);
    };

    return (
      <button
        type="button"
        ref={ref}
        data-slot="input-otp-slot"
        data-active={isActive}
        className={cn(
          "border-input data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px] cursor-pointer",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
          </div>
        )}
      </button>
    )
  }
)
InputOTPSlot.displayName = "InputOTPSlot"

// InputOTPSeparator component
const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  return (
    <div ref={ref} data-slot="input-otp-separator" {...props}>
      <MinusIcon />
    </div>
  )
})
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
