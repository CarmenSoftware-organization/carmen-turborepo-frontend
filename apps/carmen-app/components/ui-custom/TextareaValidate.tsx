import * as React from "react";

import { cn } from "@/lib/utils";

const TextareaValidate = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, maxLength, onChange, value, defaultValue, ...props }, ref) => {
    const [length, setLength] = React.useState(() => {
      const val = value || defaultValue || "";
      return String(val).length;
    });

    React.useEffect(() => {
      if (value !== undefined) {
        setLength(String(value).length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLength(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <textarea
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "bg-background flex min-h-[60px] w-full rounded-md border border-border px-3 py-2 shadow-sm placeholder:text-muted-foreground/40 dark:placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted disabled:cursor-not-allowed disabled:opacity-50",
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
TextareaValidate.displayName = "TextareaValidate";

export { TextareaValidate };
