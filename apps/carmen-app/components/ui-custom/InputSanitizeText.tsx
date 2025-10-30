import * as React from "react";
import { cn } from "@/lib/utils";

const sanitizeText = (text: string) => {
  return text.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF\u200B]/g, "");
};

const InputSanitizeText = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onChange, value: propValue, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState("");
    const isControlled = propValue !== undefined;
    const value = isControlled ? propValue : internalValue;

    const createChangeEvent = (
      target: HTMLInputElement,
      newValue: string
    ): React.ChangeEvent<HTMLInputElement> => {
      const event = new Event("change", {
        bubbles: true,
      }) as unknown as React.ChangeEvent<HTMLInputElement>;
      // Type assertion needed for synthetic event creation
      (event as { target: HTMLInputElement; currentTarget: HTMLInputElement }).target = target;
      (event as { target: HTMLInputElement; currentTarget: HTMLInputElement }).currentTarget =
        target;

      Object.defineProperty(target, "value", {
        writable: true,
        value: newValue,
      });

      return event;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const clean = sanitizeText(e.target.value);

      if (!isControlled) {
        setInternalValue(clean);
      }

      if (onChange) {
        const syntheticEvent = createChangeEvent(e.target, clean);
        onChange(syntheticEvent);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      const clean = sanitizeText(pastedText);

      if (!isControlled) {
        setInternalValue(clean);
      }

      if (onChange) {
        const syntheticEvent = createChangeEvent(e.target as HTMLInputElement, clean);
        onChange(syntheticEvent);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        onFocus={(e) => e.target.select()}
        {...props}
      />
    );
  }
);

InputSanitizeText.displayName = "InputSanitizeText";

export { InputSanitizeText };
