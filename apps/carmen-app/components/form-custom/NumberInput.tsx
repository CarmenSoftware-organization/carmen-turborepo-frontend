import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface InputNumberProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly showContent?: boolean;
  readonly permission?: "view" | "edit" | "view-edit";
  readonly viewStage?: "enable" | "disable" | "hidden";
  readonly classNames?: string;
  readonly suffix?: React.ReactNode;
}

export default function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  placeholder,
  showContent = true,
  permission = "view-edit",
  viewStage = "enable",
  classNames,
  suffix,
}: InputNumberProps) {
  const [localValue, setLocalValue] = useState<string>(String(value || 0));

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(String(value || 0));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);
  };

  const commitValue = (): void => {
    if (localValue === "" || localValue === "-") {
      onChange(0);
      setLocalValue("0");
      return;
    }

    const numericValue = Number(localValue);

    if (!Number.isNaN(numericValue) && Number.isFinite(numericValue)) {
      onChange(numericValue);
    } else {
      setLocalValue(String(value || 0));
    }
  };

  const handleBlur = (): void => {
    commitValue();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" || e.key === "Tab") {
      commitValue();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>): void => {
    e.currentTarget.select();
  };

  const isHide = showContent || viewStage === "hidden";

  return (
    <div className="relative">
      <Input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        min={min}
        max={max}
        step={step}
        disabled={
          disabled || permission === "view" || viewStage === "disable" || showContent === false
        }
        placeholder={isHide ? placeholder : "••••••••"}
        readOnly={!showContent}
        className={cn(
          "text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
          suffix && "pr-7",
          classNames
        )}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
  );
}
