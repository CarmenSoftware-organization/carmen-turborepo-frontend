import * as React from "react";

import { cn } from "@/lib/utils";

const InputValidate = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, maxLength, onChange, value, defaultValue, ...props }, ref) => {
    const [length, setLength] = React.useState(() => {
      const val = value || defaultValue || "";
      return String(val).length;
    });

    React.useEffect(() => {
      if (value !== undefined) {
        setLength(String(value).length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLength(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/40 dark:placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
          onFocus={(e) => e.target.select()}
        />
        {maxLength && (
          <div className="flex justify-end mt-1">
            <span className="text-[10px] text-muted-foreground">
              {length}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);
InputValidate.displayName = "InputValidate";

export { InputValidate };
